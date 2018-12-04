
const OptionsValidator = require('./optionsValidator.js');
const CSVGenerator = require('./csvGenerator');

class Generator {
	constructor() {
		this.optionsValidator = new OptionsValidator();
		this.csvGenerator = new CSVGenerator();
	}

	async runGenerator(options) {
		try {
			const valid = await this.optionsValidator.validateOptions(options)
			if (valid) {
				await this.csvGenerator.generateData(options);
				console.log('Generation completed.')
			}        
		} catch (exception) {
			console.error(exception);
			console.error(exception.message);
			console.info('Generation not finalized.')
		}
	}
}

module.exports = Generator;
