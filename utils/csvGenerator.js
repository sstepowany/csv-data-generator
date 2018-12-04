const fs = require('fs');
const _ = require('lodash');
const CSVWritter = require('./csvWritter.js');
const CSVDataGenerator = require('./csvDataGenerator.js');

class CSVGenerator {
    constructor() {
        this.csvWritter = new CSVWritter();
        this.csvDataGenerator = new CSVDataGenerator();
        this.csvConfigurationFileEncoding = 'utf8';
        this.miniumDataRowsCount = 1;
    }

    async prepareCsvData(options) {
        const csvColmunsStructure = JSON.parse(fs.readFileSync(options.csvConfigurationFilePath, this.csvConfigurationFileEncoding));
        const a = parseInt(options.dataRowsCount);
        if (!_.isNumber(a) || options.dataRowsCount < this.miniumDataRowsCount) {
            throw new Error('Incorrect data rows count provided.');
        }
        const csvResult = this.csvDataGenerator.generateData(options.dataRowsCount, csvColmunsStructure)
        return csvResult;
    }

    async generateData(options) {
        const csvData = await this.prepareCsvData(options);
        await this.csvWritter.writeCSVFiles(csvData, options.csvFilesNames, options.outputPath, options.csvFilesPathToMergeWith);
    }
}

module.exports = CSVGenerator;
