#  csv-data-generator

## Getting Started
These instructions will get you a copy of the project up and running on your machine.

### Installing
1. Install Node.
2. Run command: `npm install` from the root level of the tool.

### Possible npm scripts
| Script    | Description                          |
|-----------|--------------------------------------|
| generate  | Starts generation of csv data files. |

### Possible generator options
To receive a list with possible options run a command: `npm run generate -- -h`.

### CSV data configuration
Configuration must be written in a `*.json` file.
Example configuration json file is provided in the `configuration/exampleConfiguration.json` file.
Example configuration provides information about all accepted data types and their strategies.

### Example usage
1. To generate 10 data rows and save 2 new csv files with names `test1.csv` and `test2.csv` run a command: `npm run generate -- -c configuration/examplecConfiguration.json -n test1;test2 -d 10`.
2. To append an already generated csv file use a command: `npm run generate -- -c configuration/exampleConfiguration.json -m output/test.csv -d 10`.
   1. Adding extra data columns to a new csv configuration will not add new column names in the output file.
   2. Extra data for columns will be added.
   3. Merging will overwrite a provided csv file. 
3. To use ranged option in generator fill `dataRange` property in configuration file.
   1. Property `restFieldsRangeGapsStrategy` can `propagate` gaps between ranges or `ignore` them.

### Output
1. By default all output data is saved in an `output` folder.
2. To change a default output directory use `-o` option.
