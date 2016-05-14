'use strict';

const U = require('../lib/u');

module.exports = function (app) {
	const log = app.API.log;
	const sendContactEmail = app.API.commands.sendContactEmail;

	return function contactController(req, res) {
		const formErrors = [];

		const form = {
			firstName: req.body.first_name,
			lastName: req.body.last_name,
			email: req.body.email,
			phoneNumber: req.body.phone_number,
			inquiry: req.body.inquiry
		};

		if (!U.isFullString(form.firstName)) {
			formErrors.push('First name is required');
		}
		if (!U.isFullString(form.email)) {
			formErrors.push('Email is required');
		}

		if (formErrors.length) {
			res.render('contact', {formError: formErrors[0], form});
		} else {
			sendContactEmail(form)
				.then(() => {
					log.info('contact email sent');
				})
				.catch(err => {
					log.error(err, 'error sending contact email');
				});

			res.render('contact_confirm');
		}
	};
};
