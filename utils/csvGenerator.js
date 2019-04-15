const fs = require('fs');
const _ = require('lodash');
const CSVWriter = require('./csvWriter.js');
const CSVDataGenerator = require('./csvDataGenerator.js');
const OptionsValidator = require('./optionsValidator.js');

class CSVGenerator {
    constructor() {
        this.csvWriter = new CSVWriter();
        this.csvDataGenerator = new CSVDataGenerator();
        this.optionsValidator = new OptionsValidator();
        this.csvConfigurationFileEncoding = 'utf8';
        this.miniumDataRowsCount = 1;
    }

    async prepareCsvData(options) {
        const csvConfiguration = JSON.parse(fs.readFileSync(options.csvConfigurationFilePath, this.csvConfigurationFileEncoding));
        const dataRowsCount = parseInt(options.dataRowsCount);
        if (dataRowsCount) {
            if (!_.isNumber(dataRowsCount) || options.dataRowsCount < this.miniumDataRowsCount) {
                throw new Error('Incorrect data rows count provided.');
            }
            console.log('Generating data based on data count.');
            return this.csvDataGenerator.generateDataWithRowsCount(options.dataRowsCount, csvConfiguration.columnsStructure);
        } else {
            console.log('Generating data based on data range.');
            return this.csvDataGenerator.generateDataForRangedData(csvConfiguration.dataRange, csvConfiguration.columnsStructure);
        }
    }

    async generateData(options) {
        try {
            const valid = await this.optionsValidator.validateOptions(options);
            if (valid) {
                const csvData = await this.prepareCsvData(options);
                await this.csvWriter.writeCSVFiles(csvData, options.csvFilesNames, options.outputPath, options.csvFilesPathToMergeWith);
                console.log('Generation completed.')
            }
        } catch (exception) {
            console.error(exception);
            console.error(exception.message);
            console.info('Generation not finalized.')
        }
    }
}

module.exports = CSVGenerator;
