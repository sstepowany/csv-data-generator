const _ = require('lodash');
const BaseGenerator = require('./baseGenerator.js');

class NumberGenerator extends BaseGenerator {
    constructor() {
        super();
        this.allowedStrategiesMap = _.assign(this.allowedStrategiesMap, {
            multiply: function* (value, metaInfo) {
                value = Number(value) / metaInfo.operand;
                while (true) {
                    value *= metaInfo.operand;
                    yield value;
                }
            },
            add: function* (value, metaInfo) {
                value = Number(value) - metaInfo.operand;
                while (true) {
                    value += metaInfo.operand;
                    yield value;
                }
            },
            remove: function* (value, metaInfo) {
                value = Number(value) + metaInfo.operand;
                while (true) {
                    value -= metaInfo.operand;
                    yield value;
                }
            },
            divide: function* (value, metaInfo) {
                value = Number(value) * metaInfo.operand;
                if (metaInfo.operand === 0) throw new Error('Dividing by 0 huh? You little evil.');
                while (true) {
                    value /= metaInfo.operand;
                    yield value;
                }
            }
        });
    }
}

module.exports = NumberGenerator;
