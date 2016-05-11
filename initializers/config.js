'use strict';

const U = require('../lib/u');

module.exports = function (app) {
	const debug = app.debug('initializeConfig');
	debug('initializing');

	app.config.server = {
		port: normalizePort(process.env.PORT) || 3000,
		host: process.env.HOST || '0.0.0.0'
	};

	app.config.log = {
		level: (process.env.LOG_LEVEL || 'debug').toLowerCase()
	};

	app.config.express = {
		paths: {
			views: app.appdir.append('views').toString(),
			partials: app.appdir.append('views', 'partials').toString(),
			helpers: app.appdir.append('views', 'helpers').toString(),
			static: app.appdir.append('public').toString()
		}
	};

	app.config.pagedata = getPageData(app);

	U.deepFreeze(app.config);
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
