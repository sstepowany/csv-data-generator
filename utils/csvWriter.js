const fs = require('fs');
const path = require('path');
const ObjectsToCsv = require('objects-to-csv');
const Promise = require('bluebird');
const _ = require('lodash');


class CsvWriter {
    constructor() {
        this.csvDefaultOutputDirectory = 'output';
        this.csvFileExtension = '.csv';
        this.filesNamesAndPathsSplitter = ';';
    }

    async writeCSVFiles(csvData, csvFilesNamesChain, outputPath, csvFilesPathsToMergeWith) {
        const csv = new ObjectsToCsv(csvData);
        if (!_.isUndefined(csvFilesPathsToMergeWith)) {
            const csvFilesPaths = _.split(csvFilesPathsToMergeWith, this.filesNamesAndPathsSplitter);
            await Promise.each(csvFilesPaths, async csvFilePath => {
                await csv.toDisk(csvFilePath, { append: true });
                console.log(`Written data file: ${csvFilePath}.`);
            });
        } else {
            const csvFilesNames = _.split(csvFilesNamesChain, this.filesNamesAndPathsSplitter);
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

module.exports = CsvWriter;
