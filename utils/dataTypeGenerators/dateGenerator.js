const _ = require('lodash');
const moment = require('moment');
const BaseGenerator = require('./baseGenerator.js');

class DateGenerator extends BaseGenerator {
    constructor() {
        super();
        this.allowedStrategiesMap = _.assign(this.allowedStrategiesMap, {
            add: function* (startDate, metaInfo) {
                let date = moment.utc(startDate).subtract(metaInfo.interval, metaInfo.intervalUnit).format(metaInfo.dateFormat);
                while (true) {
                    date = moment.utc(date).add(metaInfo.interval, metaInfo.intervalUnit).format(metaInfo.dateFormat);
                    yield date;
                }
            },
            remove: function* (startDate, metaInfo) {
                let date = moment.utc(startDate).add(metaInfo.interval, metaInfo.intervalUnit).format(metaInfo.dateFormat);
                while (true) {
                    date = moment.utc(date).subtract(metaInfo.interval, metaInfo.intervalUnit).format(metaInfo.dateFormat);
                    yield date;
                }
            }
        });
    }
}

module.exports = DateGenerator;
