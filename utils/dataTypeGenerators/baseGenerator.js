const _ = require('lodash');

class BaseGenerator {
    constructor() {
        this.allowedStrategiesMap = {
            constant: function* (value) {
                yield value;
            }
        };
    }

    * generator(initialValue, metaInfo, strategy) {
        while (true) {
            if (_.has(this.allowedStrategiesMap, strategy)) {
                if (_.isUndefined(metaInfo)) {
                    yield* this.allowedStrategiesMap[strategy](initialValue);
                } else {
                    yield* this.allowedStrategiesMap[strategy](initialValue, metaInfo);
                }
            } else {
                throw new Error(`Not allowed strategy "${strategy}" for ${this.constructor.name}.`);
            }
        }
    }
}

module.exports = BaseGenerator;
