'use strict';

const AWS = require('aws-sdk');

const U = require('../lib/u');

module.exports = function (app) {
	const configs = app.config.awsSES;

	if (!U.isFullString(configs.accessKeyId)) {
		app.API.log.error('Missing AWS_SES_ACCESS_KEY_ID for sending email');
	}
	if (!U.isFullString(configs.secretAccessKey)) {
		app.API.log.error('Missing AWS_SES_SECRET_ACCESS_KEY for sending email');
	}
	if (!U.isFullString(configs.region)) {
		app.API.log.error('Missing AWS_SES_REGION for sending email');
	}

	app.API.AWS = Object.create(null);

	app.API.AWS.ses = new AWS.SES({
		apiVersion: '2010-12-01',
		accessKeyId: configs.accessKeyId,
		secretAccessKey: configs.secretAccessKey,
		region: configs.region
	});
};
