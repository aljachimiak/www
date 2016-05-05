'use strict';

const env = process.env.NODE_ENV;

// Require and start Opbeat before anything else
// https://opbeat.com/docs/articles/get-started-with-express/
const opbeat = require('opbeat').start({
	organizationId: process.env.OPBEAT_ORGANIZATION_ID,
	appId: process.env.OPBEAT_APP_ID,
	secretToken: process.env.OPBEAT_SECRET_TOKEN,
	instrument: true,
	hostname: env === 'production' ? 'www.oddnetworks.com' : 'staging.oddnetworks.com',
	active: env === 'production' || env === 'staging'
});

const initialize = require('./lib/initialize');

// Main
// Where the magic happens.
exports.main = function () {
	const options = {
		appdir: __dirname,
		environment: env || 'development'
	};

	const initializers = [
		require('./initializers/config'),
		require('./initializers/api-logger'),
		initializeOpbeat,
		require('./initializers/api-handle-error'),
		require('./initializers/api-queries'),
		require('./initializers/api-controllers'),
		require('./initializers/api-express'),
		require('./initializers/routes'),
		require('./initializers/api-server')
	];

	return initialize(initializers, options);
};

function initializeOpbeat(app) {
	app.API.opbeat = opbeat;
	return app;
}
