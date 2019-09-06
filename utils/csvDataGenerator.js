const _ = require('lodash');
const DateGenerator = require('./dataTypeGenerators/dateGenerator.js');
const NumberGenerator = require('./dataTypeGenerators/numberGenerator.js');
const TextGenerator = require('./dataTypeGenerators/textGenerator.js');
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
                columnData.strategy
            );
            for (let i = 0; i < dataCount; i++) {
                if (!_.isObject(csvResult[i])) csvResult[i] = {};
                csvResult[i][columnName] = generator.next().value;
            }
            return csvResult;
        } else {
            throw new Error(`Incorrect generator data type: ${columnData.dataType} for column ${columnName}.`);
        }
    }

    generateDataWithGaps(csvResult, columnName, columnData, generatorsMap, classifiedDataRanges) {
        if (_.has(generatorsMap, columnData.dataType)) {
            const generator = generatorsMap[columnData.dataType](
                columnData.initialData,
                columnData.metaInfo,
                columnData.strategy
            );
            let counter = 0;
            _.each(classifiedDataRanges, rangeData => {
                for (let i = 0; i < rangeData.rangeCount; i++) {
                    const index = i + counter;
                    if (!_.isObject(csvResult[index])) csvResult[index] = {};
                    csvResult[index][columnName] = generator.next().value;
                }
                counter += rangeData.rangeCount;

                for (let i = 0; i < rangeData.nextRangeDistance; i++) {
                    generator.next();
                }
            });
        } else {
            throw new Error(`Incorrect generator data type: ${columnData.dataType} for column ${columnName}.`);
        }

        return csvResult;
    }

    generateDataWithRangedDataResults(
        dataCount,
        csvColumnsStructure,
        rangeColumn,
        rangedData,
        restFieldsRangeGapsStrategy,
        classifiedDataRanges
    ) {
        const generatorsMap = this.prepareGeneratorsMap();
        let csvResult = [];
        _.each(csvColumnsStructure, (columnData, columnName) => {
            if (columnName === rangeColumn) {
                for (let i = 0; i < dataCount; i++) {
                    if (!_.isObject(csvResult[i])) csvResult[i] = {};
                    csvResult[i][columnName] = rangedData[i][columnName];
                }
            } else {
                if (restFieldsRangeGapsStrategy === 'propagate') {
                    csvResult = this.generateDataWithGaps(csvResult, columnName, columnData, generatorsMap, classifiedDataRanges.ranges);
                } else if (restFieldsRangeGapsStrategy === 'ignore') {
                    csvResult = this.generateData(csvResult, generatorsMap, columnName, columnData, dataCount);
                } else {
                    throw new Error('Provided incorrect strategy for rest fields handling.');
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
        let rangedColumnResult = [];
        const dataRangeClassifier = new DataRangeClassifier();
        const classifiedDataRanges = dataRangeClassifier.classifyDataRanges(
            dataRange.conditions,
            csvColumnsStructure[dataRange.column]
        );
        if (_.has(generatorsMap, csvColumnsStructure[dataRange.column].dataType)) {
            _.each(classifiedDataRanges.ranges, conditionRange => {
                const partialColumnsResult = [];
                const generator = generatorsMap[csvColumnsStructure[dataRange.column].dataType](
                    conditionRange.start,
                    csvColumnsStructure[dataRange.column].metaInfo,
                    csvColumnsStructure[dataRange.column].strategy
                );

                let value = conditionRange.start;
                for (let i = 0; i < conditionRange.rangeCount; i++) {
                    value = generator.next().value;
                    partialColumnsResult[i] = {};
                    partialColumnsResult[i][dataRange.column] = value;
                }
                rangedColumnResult = [...rangedColumnResult, ...partialColumnsResult];
            });

            return this.generateDataWithRangedDataResults(
                classifiedDataRanges.summaryDataRange,
                csvColumnsStructure,
                dataRange.column,
                rangedColumnResult,
                dataRange.restFieldsRangeGapsStrategy,
                classifiedDataRanges
            );
        } else {
            throw new Error('Incorrect generator data type: '+
                `${csvColumnsStructure[dataRange.column].dataType} for column ${dataRange.column}.`);
        }
    }
}

module.exports = CSVDataGenerator;
