const { name } = require('../package.json');
const { configure, getLogger } = require('log4js');
const path = require('path');

class Logger {
    constructor(enableLog) {
        this.enableLog = enableLog;
        configure(path.join('config', 'log4js.json'));
        this.logger = getLogger(name);
    }

    info(message) {
        if (this.enableLog) this.logger.info(message);
    }

    error(message) {
        if (this.enableLog) this.logger.error(message);
    }

    warn(message) {
        if (this.enableLog) this.logger.warn(message);
    }

    fatal(message) {
        if (this.enableLog) this.logger.fatal(message);
    }

    debug(message) {
        if (this.enableLog) this.logger.debug(message);
    }

    trace(message) {
        if (this.enableLog) this.logger.trace(message);
    }
}

module.exports = Logger;
