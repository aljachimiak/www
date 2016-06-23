'use strict';

const bodyParser = require('body-parser');
// https://github.com/expressjs/body-parser

const notFound = require('../middleware/not-found');
const errorHandling = require('../middleware/error-handling');

const ContactController = require('../controllers/contact-controller');
// const DocumentationController = require('../controllers/documentation-controller');
const NPMDownloadsController = require('../controllers/npm-downloads-controller');
const PagesController = require('../controllers/pages-controller');

// Requires:
// app.API.controllers
module.exports = function (app) {
	const debug = app.debug('initializeRoutes');
	debug('initializing');

	const express = app.API.express;

	express.all(
		'/growthstats/npm_downloads.:type',
		NPMDownloadsController.create(app)
	);

	// express.all(
	// 	'/oddworks/*',
	// 	methodsAllowed({allowed: ['GET']}),
	// 	DocumentationController.create()
	// );

	express.all(
		'/request-access',
		bodyParser.urlencoded({
			extended: false,
			parameterLimit: 8
		}),
		ContactController.create(app, {
			view: 'request-access',
			confirmationView: 'request-access-confirm'
		})
	);

	express.all('/*', PagesController.create(app));

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
