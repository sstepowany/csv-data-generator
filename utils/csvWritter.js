const fs = require('fs');
const path = require('path');
const ObjectsToCsv = require('objects-to-csv');
const Promise = require('bluebird');
const _ = require('lodash');


class CSVWritter {
    constructor() {
        this.csvDefaultOutputDirectory = 'output';
        this.csvFileExtension = '.csv';
        this.filesNamesSplitter = ';';
    }

    async writeCSVFiles(csvData, csvFilesNamesChain, outputPath, csvFilePathToMergeWith) {
        const csv = new ObjectsToCsv(csvData);
        if (!_.isUndefined(csvFilePathToMergeWith)) {
            await csv.toDisk(csvFilePathToMergeWith, { append: true });
            console.log(`Written data file: ${csvFilePathToMergeWith}.`);
        } else {
            const csvFilesNames = _.split(csvFilesNamesChain, this.filesNamesSplitter);
            if (!fs.existsSync(this.csvDefaultOutputDirectory)){
                fs.mkdirSync(this.csvDefaultOutputDirectory);
            }
            await Promise.each(csvFilesNames, async csvFileName => {
                const outputFilePath = _.isUndefined(outputPath) ?
                    path.join(this.csvDefaultOutputDirectory, `${csvFileName}${this.csvFileExtension}`) : path.join(outputPath, `${csvFileName}${this.csvFileExtension}`);
                if (fs.existsSync(outputFilePath)) {
                    fs.unlinkSync(outputFilePath);
                }
                await csv.toDisk(outputFilePath);
                console.log(`Written data file: ${outputFilePath}.`);
            });
        }
    }
}

module.exports = CSVWritter;
