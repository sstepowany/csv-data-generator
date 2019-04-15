const _ = require('lodash');

class DataRangeClassifier {
    constructor() {
        this.dataRangeSeparator = ' - ';
    }

    classifyDataRanges(dataRanges, rangeColumnConfiguration) {
        const ranges = [];
        _.each(dataRanges, range => {
            const dataRange = _.split(range, this.dataRangeSeparator);
            ranges.push({
               start: dataRange[0],
               end: dataRange[1]
            });
        });
        return ranges;
    }
}

module.exports = DataRangeClassifier;
