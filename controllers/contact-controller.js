'use strict';

const U = require('../lib/u');
const controller = require('../lib/controller');

class ContactController {
	constructor(app, options) {
		this.log = app.API.log;
		this.view = options.view;
		this.confirmationView = options.confirmationView;
		this.pagedata = U.cloneDeep(app.config.pagedata);
	}

	get(req, res) {
		const locals = U.merge(
			{},
			this.pagedata[this.view],
			this.pagedata.index
		);
		res.status(200).render(this.view, locals);
	}

	post(req, res) {
		const formErrors = [];

		const form = {
			source: this.view,
			email: req.body.email,
			firstName: req.body.first_name,
			lastName: req.body.last_name,
			inquiry: req.body.inquiry
		};

		if (!U.isFullString(form.email)) {
			formErrors.push('Email is required');
		}
		if (!U.isFullString(form.firstName)) {
			formErrors.push('First name is required');
		}

		let locals = U.cloneDeep(this.pagedata.index);

		if (formErrors.length) {
			locals = this.pagedata[this.view] || locals;
			res.render(
				this.view,
				U.merge({}, locals, {formError: formErrors[0], form})
			);
		} else {
			// TODO Send To Infusionsoft
			this.log.info({form}, 'SIGNUP');
			locals = this.pagedata[this.confirmationView] || locals;
			res.status(201).render(this.confirmationView, locals);
		}
	}

	static create(app, options) {
		return controller.create(new ContactController(app, options));
	}
}

module.exports = ContactController;
