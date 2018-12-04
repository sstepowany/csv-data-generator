#  csv-data-generator

## Getting Started

These instructions will get you a copy of the project up and running on your machine.

### Prerequisites
- [Node](https://nodejs.org/en/) version used: v10.14.1. (At least on which the tool was written.)

### Installing
1. Install Node.
2. Run command: `npm install` from the root level of the tool.

### Possible npm scripts
| Script    | Description                                                       |
|-----------|--------------------------------------|
| generate  | Starts generation of csv data files. |

### Possible scripts options
To receive a list with possible options run command: `npm run generate -- -h`.

### CSV data configuration
Configuration must be written in a `*.json` file.
Example configuration json file is provided in the `configuration/exampleConfiguration.json` file.

### Example usage
1. To generate 10 data rows and save 2 new csv files with names `test1.csv` and `test2.csv` run a command: `npm run generate -- -c configuration/examplecConfiguration.json -n test1;test2 -d 10`.
2. To append an already generated csv file use a command: `npm run generate -- -c configuration/exampleConfiguration.json -m output/test.csv -d 10`.
   1. Keep in mind that adding extra data columns to a new csv configuration will not add new column names in the output file.
   2. Extra data for columns will be added.

### Output
1. By default all output data is saved in an `output` folder.
2. To change a default output directory use a `-o` option.