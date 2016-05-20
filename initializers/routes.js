'use strict';

const bodyParser = require('body-parser');
// https://github.com/expressjs/body-parser

const notFound = require('../middleware/not-found');
const methodsAllowed = require('../middleware/methods-allowed');
const errorHandling = require('../middleware/error-handling');

// Requires:
// app.API.controllers
module.exports = function (app) {
	const debug = app.debug('initializeRoutes');
	debug('initializing');

	const express = app.API.express;

	express.all(
		'/growthstats/npm_downloads.:type',
		methodsAllowed({allowed: ['GET']}),
		app.API.controllers.npmDownloadsController
	);

	express.all(
		'/oddworks/*',
		methodsAllowed({allowed: ['GET']}),
		app.API.controllers.documentationController
	);

	express.post(
		'/contact/',
		bodyParser.urlencoded({
			extended: false,
			parameterLimit: 8
		}),
		app.API.controllers.contactController
	);

	express.all(
		'/contact/',
		methodsAllowed({allowed: ['GET']}),
		app.API.controllers.pagesController
	);

	express.all(
		'/',
		methodsAllowed({allowed: ['GET']}),
		app.API.controllers.pagesController
	);

	// Catch 404 errors
	express.use(notFound(app));

	// Error handling middleware must go last, after all other middleware
	// and routes have been defined.

	// Opbeat error handler needs to be first
	express.use(app.API.opbeat.middleware.express());

	// Our catch-all error handler
	express.use(errorHandling({
		handler: app.API.handleError
	}));

	debug('initialized');
	return app;
};
