const _ = require('lodash');
const moment = require('moment');

class DataRangeClassifier {
    constructor() {
        this.dataRangeSeparator = ' - ';
    }

    dateRangesHandler(dataRanges, rangeColumnConfiguration, dataRange, nextRange) {
        let nextRangeDistance = 0;
        const start = moment.utc(dataRange[0]);
        const end = moment.utc(dataRange[1]);
        const rangeCount = Math.abs(start.diff(end, rangeColumnConfiguration.metaInfo.intervalUnit)) /
            rangeColumnConfiguration.metaInfo.interval + 1;

        if (nextRange) {
            const nextRangeStart = moment.utc(nextRange[0]);
            nextRangeDistance = Math.abs(end.diff(nextRangeStart, rangeColumnConfiguration.metaInfo.intervalUnit)) /
                rangeColumnConfiguration.metaInfo.interval;
        } else {
            nextRangeDistance = -1;
        }

        return { start: dataRange[0], end: dataRange[1], rangeCount, nextRangeDistance };
    }

    numericRangesHandler(dataRanges, rangeColumnConfiguration, dataRange, nextRange) {
        let nextRangeDistance = 0;
        const start = dataRange[0];
        const end = dataRange[1];

        // TODO: Split range handler for different strategies


        const rangeCount = Math.abs(end - start) + 1;

        if (nextRange) {
            const nextRangeStart = nextRange[0];
            nextRangeDistance = Math.abs(end - nextRangeStart);
        } else {
            nextRangeDistance = -1;
        }

        return { start, end, rangeCount, nextRangeDistance };
    }

    classifyDataRanges(dataRanges, rangeColumnConfiguration) {
        let summaryDataRange = 0;
        const ranges = [];
        const dataRangesHandlersMap = {
            date: this.dateRangesHandler,
            numeric: this.numericRangesHandler
        };

        for (let i = 0; i < dataRanges.length; i++) {
            const nextRange = dataRanges[i+1] ? _.split(dataRanges[i+1], this.dataRangeSeparator) : undefined;
            const dataRange = _.split(dataRanges[i], this.dataRangeSeparator);

            const range = dataRangesHandlersMap[rangeColumnConfiguration.dataType](
                dataRanges,
                rangeColumnConfiguration,
                dataRange,
                nextRange
            );
            ranges.push(range);
            summaryDataRange += range.rangeCount;
        }

        return { summaryDataRange, ranges };
    }
}

module.exports = DataRangeClassifier;
