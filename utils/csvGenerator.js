const fs = require('fs');
const _ = require('lodash');
const CSVWritter = require('./csvWritter.js');
const CSVDataGenerator = require('./csvDataGenerator.js');

class CSVGenerator {
    constructor(options) {
        this.generatorOptions = options;
        this.csvWritter = new CSVWritter();
        this.csvDataGenerator = new CSVDataGenerator();
        this.csvConfigurationFileEncoding = 'utf8';
        this.miniumDataRowsCount = 1;
    }

    async prepareCsvData() {
        const csvColmunsStructure = JSON.parse(fs.readFileSync(this.generatorOptions.csvConfigurationFilePath, this.csvConfigurationFileEncoding));
        const a = parseInt(this.generatorOptions.dataRowsCount);
        if (!_.isNumber(a) || this.generatorOptions.dataRowsCount < this.miniumDataRowsCount) {
            throw new Error('Incorrect data rows count provided.');
        }
        const csvResult = this.csvDataGenerator.generateData(this.generatorOptions.dataRowsCount, csvColmunsStructure)
        return csvResult;
    }

    async generateData() {
        const csvData = await this.prepareCsvData();
        await this.csvWritter.writeCSVFiles(csvData, this.generatorOptions.csvFilesNames, this.generatorOptions.outputPath, this.generatorOptions.csvFilePathToMergeWith);
    }
}

module.exports = CSVGenerator;
