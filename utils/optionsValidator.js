class OptionsValidator {
    async validateOptions(options) {
        if (options.csvFilesNames && options.csvFilePathToMergeWith) {
          throw new Error('Provided both: csvFilesNames and csvFilePathToMergeWith parameters. Only one allowed at a time.');
        }
        return true;
    }
}

module.exports = OptionsValidator;
