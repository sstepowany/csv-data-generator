const CSVGenerator = require('./utils/csvGenerator');

/**
 * Generates a csv file based on a provided configuration.
 * @param  {Object} options.
 *      @objectProperty {String} csvConfigurationFilePath   CSV configuration json file path.
 *      @objectProperty {String} csvFilesNames              New CSV files names. Without "csv" extension. Separated by ";".
 *      @objectProperty {String} csvFilesPathToMergeWith    CSV files to merge new generated data with. Cannot be provided if csvFilesNames option was given. Separated by ";".
 *      @objectProperty {Int}    dataRowsCount              Data rows count for the CSV file.
 *      @objectProperty {String} outputPath                 Output path for generated csv data. Valid only with csvFilesNames command.
 *      @objectProperty {String} replaceInitialData         Replace initial data for defined column in configuration. Ex. NUMBER_COLUMN=1,STRING_COLUMN=abc.
 */
exports.generate = async (options) => {
    const csvGenerator = new CSVGenerator();
    await csvGenerator.generateData(options);
};
