'use strict';

module.exports = function (app) {
	const debug = app.debug('initializeConfig');
	debug('initializing');

	// Server
	app.config.server = {
		port: normalizePort(process.env.PORT) || 3000,
		host: process.env.HOST || '0.0.0.0'
	};

	// Logging
	app.config.log = {
		level: (process.env.LOG_LEVEL || 'debug').toLowerCase()
	};

	// Express.js
	app.config.express = {
		paths: {
			views: app.appdir.append('views').toString(),
			partials: app.appdir.append('views', 'partials').toString(),
			helpers: app.appdir.append('views', 'helpers').toString(),
			static: app.appdir.append('public').toString()
		},
		locals: {
			googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION,
			stylesheet: '/assets/css/main.css'
		}
	};

	// Middleware
	app.config.middleware = {
		static: {
			maxAge: app.environment === 'production' ? '30d' : 0
		}
	};

	// DynamoDB
	if (!process.env.DYNAMODB_ACCESS_KEY_ID) {
		console.error('Missing DYNAMODB_ACCESS_KEY_ID');
	}
	if (!process.env.DYNAMODB_SECRET_ACCESS_KEY) {
		console.error('Missing DYNAMODB_SECRET_ACCESS_KEY');
	}
	if (!process.env.DYNAMODB_REGION) {
		console.error('Missing DYNAMODB_REGION');
	}
	if (!process.env.DYNAMODB_ENDPOINT) {
		console.error('Missing DYNAMODB_ENDPOINT');
	}
	app.config.dynamodb = {
		accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
		secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY,
		region: process.env.DYNAMODB_REGION,
		endpoint: process.env.DYNAMODB_ENDPOINT,
		tablePrefix: dynamoDBTablePrefix()
	};
	app.config.dynamodbSchema = {
		oauth: {} // eslint-disable-line camelcase
	};

	if (!process.env.INFUSIONSOFT_CLIENT_ID) {
		debug('missing env var INFUSIONSOFT_CLIENT_ID');
	}
	if (!process.env.INFUSIONSOFT_SECRET) {
		debug('missing env var INFUSIONSOFT_SECRET');
	}

	// Infusionsoft
	app.config.infusionsoft = {
		clientId: process.env.INFUSIONSOFT_CLIENT_ID,
		clientSecret: process.env.INFUSIONSOFT_SECRET,
		redirectUri: 'https://www.oddnetworks.com/oauth/infusionsoft'
	};

	// Paths
	app.config.pagedata = getPageData(app);

	debug('initialized');
	return app;
};

function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

function getPageData(app) {
	const file = app.appdir.append('pagedata', 'pages.json');
	return require(file.toString());
}

function dynamoDBTablePrefix() {
	switch (process.env.NODE_ENV) {
		case 'test':
			return 'odd_www_test';
		case 'staging':
			return 'odd_www_staging';
		case 'production':
			return 'odd_www';
		default:
			return 'odd_www_development';
	}
}
