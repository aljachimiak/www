'use strict';

const U = require('../lib/u');
const controller = require('../lib/controller');

class ContactController {
	constructor(app, options) {
		this.view = options.view;
		this.confirmationView = options.confirmationView;
		this.locals = U.cloneDeep(app.config.pagedata[this.view] || {});
	}

	get(req, res) {
		res.status(200).render(this.view, this.locals);
	}

	post(req, res) {
		const formErrors = [];

		const form = {
			firstName: req.body.first_name,
			lastName: req.body.last_name,
			email: req.body.email,
			inquiry: req.body.inquiry
		};

		if (!U.isFullString(form.email)) {
			formErrors.push('Email is required');
		}
		if (!U.isFullString(form.firstName)) {
			formErrors.push('First name is required');
		}

		if (formErrors.length) {
			const locals = {formError: formErrors[0], form};
			res.render(this.view, U.merge({}, this.locals, locals));
		} else {
			// TODO Send To Infusionsoft
			res.render(this.confirmationView);
		}
	}

	static create(app, options) {
		return controller.create(new ContactController(app, options));
	}
}

module.exports = ContactController;
