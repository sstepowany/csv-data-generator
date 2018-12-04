
const OptionsValidator = require('./optionsValidator.js');
const CSVGenerator = require('./csvGenerator');

class Generator {
	constructor() {
		this.optionsValidator = new OptionsValidator();
	}

	async runGenerator(options) {
		try {
			const valid = await this.optionsValidator.validateOptions(options)
			if (valid) {
				const csvGenerator = new CSVGenerator(options);
				await csvGenerator.generateData();	
				console.log('Generation completed.')
			}        
		} catch (exception) {
			console.debug(exception);
			console.error(exception.message);
			console.info('Generation not finalized.')
		}
	}
}

module.exports = Generator;
