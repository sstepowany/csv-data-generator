const _ = require('lodash');
const DateGenerator = require('./dataTypeGenerators/dateGenerator.js');
const NumberGenerator = require('./dataTypeGenerators/numberGenerator.js');
const TextGenerator = require('./dataTypeGenerators/TextGenerator.js');

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

    generateData(dataCount, csvColunnsStructure) {
        const generatorsMap = this.prepareGeneratorsMap();
        const csvResult = [];
        _.each(csvColunnsStructure, (columnData, columnName) => {
            if (_.has(generatorsMap, columnData.dataType)) {
                const generator = generatorsMap[columnData.dataType](columnData.initialData, columnData.metaInfo, columnData.strategy);
                for (let i = 0; i < dataCount; i++) {
                    if (!_.isObject(csvResult[i])) csvResult[i] = {};
                    csvResult[i][columnName] = generator.next().value;
                }
            } else {
                throw new Error(`Incorrect generator data type: ${columnData.dataType} for column ${columnName}.`);
            }
        });
        return csvResult;
    }
}

module.exports = CSVDataGenerator;
