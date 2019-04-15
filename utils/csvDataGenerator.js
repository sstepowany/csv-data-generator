const _ = require('lodash');
const DateGenerator = require('./dataTypeGenerators/dateGenerator.js');
const NumberGenerator = require('./dataTypeGenerators/numberGenerator.js');
const TextGenerator = require('./dataTypeGenerators/TextGenerator.js');

class CSVDataGenerator {
    constructor() {
        this.dateGenerator = new DateGenerator();
        this.numberGenerator = new NumberGenerator();
        this.textGenerator = new TextGenerator();
        this.dataRangeSeparator = ' - ';
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
        const ranges = [];
        let summaryDataRange = -1;
        if (_.has(generatorsMap, csvColumnsStructure[dataRange.column].dataType)) {
            _.each(dataRange.conditions, conditionRange => {
                const dataPortionRange = _.split(conditionRange, this.dataRangeSeparator);
                const generator = generatorsMap[csvColumnsStructure[dataRange.column].dataType](
                    dataPortionRange[0],
                    csvColumnsStructure[dataRange.column].metaInfo,
                    csvColumnsStructure[dataRange.column].strategy
                );

                let value = generator.next().value;
                let dataRangeCount = 1;
                summaryDataRange++;
                rangedColumnResult[summaryDataRange] = {};
                rangedColumnResult[summaryDataRange][dataRange.column] = value;
                while (value.toString() !== dataPortionRange[1]) {
                    value = generator.next().value;
                    dataRangeCount++;
                    summaryDataRange++;
                    rangedColumnResult[summaryDataRange] = {};
                    rangedColumnResult[summaryDataRange][dataRange.column] = value;
                }
                ranges.push(dataRangeCount);
            });
            return this.generateDataWithRangedDataResults(summaryDataRange+1, csvColumnsStructure, dataRange.column, rangedColumnResult);
        } else {
            throw new Error('Incorrect generator data type: '+
                `${csvColumnsStructure[dataRange.column].dataType} for column ${dataRange.column}.`);
        }
    }

    generateDataWithRangedDataResults(dataCount, csvColumnsStructure, rangeColumn, rangedData) {
        const generatorsMap = this.prepareGeneratorsMap();
        let csvResult = [];
        _.each(csvColumnsStructure, (columnData, columnName) => {
            if (columnName === rangeColumn) {
                for (let i = 0; i < dataCount; i++) {
                    if (!_.isObject(csvResult[i])) csvResult[i] = {};
                    csvResult[i][columnName] = rangedData[i][columnName];
                }
            } else {
                csvResult = this.generateData(csvResult, generatorsMap, columnName, columnData, dataCount);
            }
        });
        return csvResult;
    }
}

module.exports = CSVDataGenerator;
