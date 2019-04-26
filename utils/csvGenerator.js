const fs = require('fs');
const _ = require('lodash');
const Logger = require('./logger.js');
const CSVWriter = require('./csvWriter.js');
const CSVDataGenerator = require('./csvDataGenerator.js');
const OptionsValidator = require('./optionsValidator.js');

class CSVGenerator {
    constructor(enableLog) {
        this.logger = new Logger(enableLog);
        this.csvWriter = new CSVWriter(this.logger);
        this.csvDataGenerator = new CSVDataGenerator();
        this.optionsValidator = new OptionsValidator();
        this.csvConfigurationFileEncoding = 'utf8';
        this.miniumDataRowsCount = 1;
    }

    async prepareCsvData(options, csvConfiguration) {
        const dataRowsCount = parseInt(options.dataRowsCount);
        if (dataRowsCount) {
            if (!_.isNumber(dataRowsCount) || options.dataRowsCount < this.miniumDataRowsCount) {
                throw new Error('Incorrect data rows count provided.');
            }
            this.logger.info('Generating data based on data count.');
            return this.csvDataGenerator.generateDataWithRowsCount(options.dataRowsCount, csvConfiguration.columnsStructure);
        } else {
            this.logger.info('Generating data based on data range.');
            return this.csvDataGenerator.generateDataForRangedData(csvConfiguration.dataRange, csvConfiguration.columnsStructure);
        }
    }

    async generateData(options) {
        try {
            const valid = await this.optionsValidator.validateOptions(options);
            if (valid) {
                const csvConfiguration = JSON.parse(fs.readFileSync(options.csvConfigurationFilePath, this.csvConfigurationFileEncoding));

                if (options.replaceInitialData) {
                    const dataToReplace = _.split(options.replaceInitialData, ',');
                    _.each(dataToReplace, columnValuePair => {
                        const splitColumnValuePair = _.split(columnValuePair, '=');
                        if (_.has(csvConfiguration.columnsStructure, splitColumnValuePair[0])) {
                            csvConfiguration.columnsStructure[splitColumnValuePair[0]].initialData = splitColumnValuePair[1];
                        }
                    });
                }

                const csvData = await this.prepareCsvData(options, csvConfiguration);
                await this.csvWriter.writeCSVFiles(csvData, options.csvFilesNames, options.outputPath, options.csvFilesPathToMergeWith);
                this.logger.info('Generation completed.')
            }
        } catch (exception) {
            throw new Error(`Generation not finalized: ${exception.message}`);
        }
    }
}

module.exports = CSVGenerator;
