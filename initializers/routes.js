'use strict';

const express = require('express');
const bodyParser = require('body-parser');
// https://github.com/expressjs/body-parser

const cacheControl = require('../middleware/cache-control');
const notFound = require('../middleware/not-found');
const errorHandling = require('../middleware/error-handling');

const ContactController = require('../controllers/contact-controller');
const InfusionsoftLinkController = require('../controllers/infusionsoft-link-controller');
const InfusionsoftController = require('../controllers/infusionsoft-controller');
// const DocumentationController = require('../controllers/documentation-controller');
const NPMDownloadsController = require('../controllers/npm-downloads-controller');
const PagesController = require('../controllers/pages-controller');

const NO_CACHE_HEADERS = {
	'Expires': '-1',
	'Cache-Control': 'no-cache, no-store'
};

const LONG_CACHE_HEADERS = {
	'Expires': 86400 * 30,
	'Cache-Control': `public, max-age=${86400 * 30}`
};

const SHORT_CACHE_HEADERS = {
	'Expires': 100,
	'Cache-Control': `public, max-age=${100}`
};

// Requires:
// app.API.controllers
module.exports = function (app) {
	const debug = app.debug('initializeRoutes');
	debug('initializing');

	app.API.express.use(cacheControl([
		{
			pattern: /^\/growthstats/,
			headers: NO_CACHE_HEADERS
		},
		{
			pattern: /^\/assets\/(img|svg)\//,
			headers: LONG_CACHE_HEADERS
		},
		{
			pattern: /^\/assets\//,
			headers: SHORT_CACHE_HEADERS
		},
		{
			pattern: /^\//,
			headers: NO_CACHE_HEADERS
		}
	]));

	app.API.express.all('/signup|contact', (req, res) => {
		res.redirect(301, '/request-access');
	});

	// Setup the static page server
	app.API.express.use(express.static(app.config.express.paths.static, {
		maxAge: app.config.middleware.static.maxAge
	}));

	app.API.express.all(
		'/growthstats/npm_downloads.:type?',
		NPMDownloadsController.create(app)
	);

	// app.API.express.all(
	// 	'/oddworks/*',
	// 	methodsAllowed({allowed: ['GET']}),
	// 	DocumentationController.create()
	// );

	app.API.express.all(
		'/infusionsoft',
		InfusionsoftLinkController.create(app)
	);

	app.API.express.all(
		'/oauth/infusionsoft',
		InfusionsoftController.create(app)
	);

	app.API.express.all(
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

	app.API.express.all(
		'/inquiry',
		bodyParser.urlencoded({
			extended: false,
			parameterLimit: 8
		}),
		ContactController.create(app, {
			view: 'inquiry',
			confirmationView: 'inquiry-confirm'
		})
	);

	app.API.express.all('/*', PagesController.create(app));

	// Catch 404 errors
	app.API.express.use(notFound(app));

	// Error handling middleware must go last, after all other middleware
	// and routes have been defined.

	// Opbeat error handler needs to be first
	app.API.express.use(app.API.opbeat.middleware.express());

	// Our catch-all error handler
	app.API.express.use(errorHandling({
		handler: app.API.handleError
	}));

	debug('initialized');
	return app;
};
