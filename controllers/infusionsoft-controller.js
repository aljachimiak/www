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
		// scope=full|wo321.infusionsoft.com&code=hf7askekx9ba8cax5x3m78nz
		const args = {
			clientId: this.config.clientId,
			clientSecret: this.config.clientSecret,
			code: req.query.code,
			grantType: this.config.grantType,
			redirectUri: this.config.redirectUri
		};

		return this.commands.infusionsoft
			.link(args)
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
