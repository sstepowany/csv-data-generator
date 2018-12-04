const _ = require('lodash');
const BaseGenerator = require('./baseGenerator.js');

class TextGenerator extends BaseGenerator {
    constructor() {
        super();
        this.allowedStrategiesMap = _.assign(this.allowedStrategiesMap, {
            randomize: function* (value, metaInfo) {
                const randomizeOffset = 2;
                const randomizationRadix = 36;
                while (true) {
                    yield value + Math.random().toString(randomizationRadix).substring(randomizeOffset, metaInfo.additionalTextLength + randomizeOffset);
                }
            }
        });
    }
}

module.exports = TextGenerator;
