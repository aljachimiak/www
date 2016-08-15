'use strict';

const controller = require('../lib/controller');

class InfusionsoftController {
	constructor(app) {
		this.config = app.config.infusionsoft;
		this.commands = app.API.commands;
	}

	// Completes the Infusionsoft OAuth linking process after a redirect
	// from Infusionsoft.
	get(req, res) {
		// req.query = scope=full|wo321.infusionsoft.com&code=hf7askeka9ba8caz5xhm78nz
		return this.commands.infusionsoft
			.link({code: req.query.code})
			.then(() => {
				res.status(200).send('success');
				return null;
			})
			.catch(err => {
				this.log.error(err, 'infusionsoft link error');
				res
					.status(200)
					.send('failed: check server logs for "infusionsoft link error"');
				return null;
			});
	}

	static create(app) {
		return controller.create(new InfusionsoftController(app));
	}
}

module.exports = InfusionsoftController;
