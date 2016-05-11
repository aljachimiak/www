'use strict';

const U = require('../lib/u');

module.exports = function (app) {
	const ses = app.API.AWS.ses;

	const template = U.template(`
	Name: <%= firstName %> <%= lastname %>
	Email: <%= email %>
	Phone Number: <%= phoneNumber %>

	Inquiry:
	<%= inquiry %>
`);

	return function sendContactEmail(args) {
		let body = 'Email parsing error: ';

		try {
			body = template(args);
		} catch (err) {
			app.API.log.error(err, 'email template error');
			body += err.message;
		}

		// AWS SES sendMail parameters
		const params = {
			Destination: {
				ToAddresses: ['sales@oddnetworks.com']
			},
			Source: 'accounts@oddnetworks.com',
			Message: {
				Subject: {
					Data: 'Website Contact Form'
				},
				Body: {
					Text: {
						Data: body
					}
				}
			},
		};

		// Return a Promise
		return new Promise((resolve, reject) => {
			ses.sendEmail(params, (err, data) => {
				if (err) {
					return reject(err);
				}
				console.log(data);
				return resolve(data);
			});
		});
	};
};
