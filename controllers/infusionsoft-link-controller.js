'use strict';

const url = require('url');
const controller = require('../lib/controller');
const U = require('../lib/u');

class InfusionsoftLinkController {
	constructor(app) {
		this.view = 'infusionsoft-link';
		const pagedata = U.cloneDeep(app.config.pagedata);
		this.locals = pagedata[this.view] || pagedata.index;
		this.config = app.config.infusionsoft;
	}

	// User initiated URL to begin the Infusionsoft linking proces.
	get(req, res) {
		const locals = U.cloneDeep(this.locals);

		/* eslint-disable camelcase */
		locals.url = url.format({
			protocol: 'https',
			host: 'signin.infusionsoft.com',
			pathname: '/app/oauth/authorize',
			query: {
				client_id: this.config.clientId,
				redirect_uri: this.config.redirectUri,
				response_type: this.config.responseType,
				scope: this.config.scope
			}
		});
		/* eslint-enable camelcase */

		res.status(200).render(this.view, locals);
	}

	static create(app) {
		return controller.create(new InfusionsoftLinkController(app));
	}
}

module.exports = InfusionsoftLinkController;
