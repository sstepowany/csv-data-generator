# csv-data-generator

## Getting Started
These instructions will get you a copy of the project up and running on your machine.

### Installing
1. Install Node (build on Node 10.14.1 version).
2. Run command: `npm install csv-data-generator`.

### Possible npm scripts
| Script    | Description                          |
|-----------|--------------------------------------|
| generate  | Starts generation of csv data files. |

### CSV data configuration
Configuration must be written in a `*.json` file.
Example configuration json file is provided in the `configuration/exampleConfiguration.json` file.
Example configuration provides information about all accepted data types and their strategies.

### Example usage
#### As a module
Tool exports single function `generate` which takes an object parameter with properties:

| Property                 | Description                                                                                                         |
|--------------------------|---------------------------------------------------------------------------------------------------------------------|
| csvConfigurationFilePath | Starts generation of csv data files.                                                                                |
| csvFilesNames            | New CSV files names. Without "csv" extension. Separated by ";".                                                     |
| csvFilesPathToMergeWith  | CSV files to merge new generated data with. Cannot be provided if csvFilesNames option was given. Separated by ";". |
| dataRowsCount            | Data rows count for the CSV file.                                                                                   |
| outputPath               | Output path for generated csv data. Valid only with csvFilesNames command.                                          |
| replaceInitialData       | Replace initial data for defined column in configuration. Ex. NUMBER_COLUMN=1,STRING_COLUMN=abc.                    |

#### As a script
1. Possible generator options
    1. To receive a list with possible options run a command: `npm run generate -- -h`.
2. To generate 10 data rows and save 2 new csv files with names `test1.csv` and `test2.csv` run a command: `npm run generate -- -c configuration/examplecConfiguration.json -n test1;test2 -d 10`.
3. To append an already generated csv file use a command: `npm run generate -- -c configuration/exampleConfiguration.json -m output/test.csv -d 10`.
   1. Adding extra data columns to a new csv configuration will not add new column names in the output file.
   2. Extra data for columns will be added.
   3. Merging will overwrite a provided csv file. 
4. To use ranged option in generator fill `dataRange` property in configuration file.
   1. Property `restFieldsRangeGapsStrategy` can `propagate` gaps between ranges or `ignore` them.

### Output
1. By default all output data is saved in an `output` folder.
2. To change a default output directory use `outputPath` parameter (`-o` option).
