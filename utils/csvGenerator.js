const fs = require('fs');
const _ = require('lodash');
const CSVWriter = require('./csvWriter.js');
const CSVDataGenerator = require('./csvDataGenerator.js');

class CSVGenerator {
    constructor() {
        this.csvWritter = new CSVWriter();
        this.csvDataGenerator = new CSVDataGenerator();
        this.csvConfigurationFileEncoding = 'utf8';
        this.miniumDataRowsCount = 1;
    }

    async prepareCsvData(options) {
        const csvColumnsStructure = JSON.parse(fs.readFileSync(options.csvConfigurationFilePath, this.csvConfigurationFileEncoding));
        const dataRowsCount = parseInt(options.dataRowsCount);
        if (!_.isNumber(dataRowsCount) || options.dataRowsCount < this.miniumDataRowsCount) {
            throw new Error('Incorrect data rows count provided.');
        }
        return this.csvDataGenerator.generateData(options.dataRowsCount, csvColumnsStructure);
    }

    async generateData(options) {
        const csvData = await this.prepareCsvData(options);
        await this.csvWritter.writeCSVFiles(csvData, options.csvFilesNames, options.outputPath, options.csvFilesPathToMergeWith);
    }

    async getCSV(columnsStructure, rowsCount) {
        const csvData = await this.csvDataGenerator.generateData(rowsCount, columnsStructure);
        return this.csvWritter.objectToCSVString(csvData);
    }
}

module.exports = CSVGenerator;
