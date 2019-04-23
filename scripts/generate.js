const program = require('commander');
const { name, version } = require('../package.json');
const CSVGenerator = require('../utils/csvGenerator.js');

program
    .description(name)
    .usage('or npm run generate')
    .version(version)
    .option('-c, --csvConfigurationFilePath <csvConfigurationFilePath>', 'CSV configuration json file path.')
    .option('-n, --csvFilesNames <csvFilesNames>', 'New CSV files names. Without "csv" extension. Separated by ";".')
    .option('-m, --csvFilesPathToMergeWith <csvFilesPathToMergeWith>', 'CSV files to merge new generated data with. Cannot be provided if csvFilesNames option was given. Separated by ";".')
    .option('-d, --dataRowsCount <dataRowsCount>', 'Data rows count for the CSV file.')
    .option('-o, --outputPath <outputPath>', 'Output path for generated csv data. Valid only with csvFilesNames command.')
    .option('-r, --replaceInitialData <replaceInitialData>', 'Replace initial data for defined column in configuration. Ex. NUMBER_COLUMN=1,STRING_COLUMN=abc.')
    .action(async options => {
        const csvGenerator = new CSVGenerator();
        console.log(options);
        await csvGenerator.generateData(options);
    })
    .parse(process.argv);
