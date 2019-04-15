const _ = require('lodash');
const DateGenerator = require('./dataTypeGenerators/dateGenerator.js');
const NumberGenerator = require('./dataTypeGenerators/numberGenerator.js');
const TextGenerator = require('./dataTypeGenerators/TextGenerator.js');
const DataRangeClassifier = require('./dataRangeClassifier');

class CSVDataGenerator {
    constructor() {
        this.dateGenerator = new DateGenerator();
        this.numberGenerator = new NumberGenerator();
        this.textGenerator = new TextGenerator();
    }

    prepareGeneratorsMap() {
        return {
            date: (initialData, metaInfo, strategy) => {
                return this.dateGenerator.generator(initialData, metaInfo, strategy);
            },
            numeric: (initialData, metaInfo, strategy) => {
                return this.numberGenerator.generator(initialData, metaInfo, strategy);
            },
            text: (initialData, metaInfo, strategy) => {
                return this.textGenerator.generator(initialData, metaInfo, strategy);
            }
        };
    }

    generateData(csvResult, generatorsMap, columnName, columnData, dataCount) {
        if (_.has(generatorsMap, columnData.dataType)) {
            const generator = generatorsMap[columnData.dataType](
                columnData.initialData,
                columnData.metaInfo,
                columnData.strategy);
            for (let i = 0; i < dataCount; i++) {
                if (!_.isObject(csvResult[i])) csvResult[i] = {};
                csvResult[i][columnName] = generator.next().value;
            }
            return csvResult;
        } else {
            throw new Error(`Incorrect generator data type: ${columnData.dataType} for column ${columnName}.`);
        }
    }

    generateDataWithRangedDataResults(dataCount, csvColumnsStructure, rangeColumn, rangedData, restFieldsRangeGapsStrategy) {
        const generatorsMap = this.prepareGeneratorsMap();
        let csvResult = [];
        _.each(csvColumnsStructure, (columnData, columnName) => {
            if (columnName === rangeColumn) {
                for (let i = 0; i < dataCount; i++) {
                    if (!_.isObject(csvResult[i])) csvResult[i] = {};
                    csvResult[i][columnName] = rangedData[i][columnName];
                }
            } else {
                if (restFieldsRangeGapsStrategy === 'ignore') {
                    csvResult = this.generateData(csvResult, generatorsMap, columnName, columnData, dataCount);
                } else if (restFieldsRangeGapsStrategy === 'propagate') {
                    // TODO: Adjust code to take gaps into account
                    csvResult = this.generateData(csvResult, generatorsMap, columnName, columnData, dataCount);
                }
            }
        });
        return csvResult;
    }

    generateDataWithRowsCount(dataCount, csvColumnsStructure) {
        const generatorsMap = this.prepareGeneratorsMap();
        let csvResult = [];
        _.each(csvColumnsStructure, (columnData, columnName) => {
            csvResult = this.generateData(csvResult, generatorsMap, columnName, columnData, dataCount);
        });
        return csvResult;
    }

    generateDataForRangedData(dataRange, csvColumnsStructure) {
        const generatorsMap = this.prepareGeneratorsMap();
        const rangedColumnResult = [];
        const dataRangeClassifier = new DataRangeClassifier();
        const classifiedDataRanges = dataRangeClassifier.classifyDataRanges(
            dataRange.conditions,
            csvColumnsStructure[dataRange.column]
        );
        let summaryDataRange = -1;
        if (_.has(generatorsMap, csvColumnsStructure[dataRange.column].dataType)) {
            _.each(classifiedDataRanges, conditionRange => {
                const generator = generatorsMap[csvColumnsStructure[dataRange.column].dataType](
                    conditionRange.start,
                    csvColumnsStructure[dataRange.column].metaInfo,
                    csvColumnsStructure[dataRange.column].strategy
                );

                let value = conditionRange.start;
                let dataRangeCount = 0;
                while (value.toString() !== conditionRange.end) {
                    value = generator.next().value;
                    dataRangeCount++;
                    summaryDataRange++;
                    rangedColumnResult[summaryDataRange] = {};
                    rangedColumnResult[summaryDataRange][dataRange.column] = value;
                }
            });
            return this.generateDataWithRangedDataResults(
                summaryDataRange+1,
                csvColumnsStructure,
                dataRange.column,
                rangedColumnResult,
                dataRange.restFieldsRangeGapsStrategy
            );
        } else {
            throw new Error('Incorrect generator data type: '+
                `${csvColumnsStructure[dataRange.column].dataType} for column ${dataRange.column}.`);
        }
    }
}

module.exports = CSVDataGenerator;
