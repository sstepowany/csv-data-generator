const program = require('commander');
const { name, version } = require('./package.json');
const Generator = require('./utils/generator.js');

program
    .description(name)
    .usage('or npm run generate')
    .version(version)
    .option('-c, --csvConfigurationFilePath <csvConfigurationFilePath>', 'CSV configuration json file path.')
    .option('-n, --csvFilesNames <csvFilesNames>', 'New CSV files names. Without "csv" extension. Separated by ";".')
    .option('-m, --csvFilesPathToMergeWith <csvFilesPathToMergeWith>', 'CSV files to merge new generated data with. Cannot be provided if csvFilesNames option was given. Separated by ";".')
    .option('-d, --dataRowsCount <dataRowsCount>', 'Data rows count for the CSV file.')
    .option('-o, --outputPath <outputPath>', 'Output path for generated csv data. Valid only with csvFilesNames command.')
    .action(async options => {
        const generator = new Generator();
        generator.runGenerator(options);
    })
    .parse(process.argv);
