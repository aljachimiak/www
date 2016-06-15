'use strict';

const express = require('express');
const hbs = require('hbs');
const filepath = require('filepath');

module.exports = function (app) {
	const debug = app.debug('initializeExpress');
	debug('initializing');

	app.API.express = express();

	// Use Handlebars for views
	// https://github.com/donpark/hbs
	app.API.express.set('views', app.config.express.paths.views);
	app.API.express.set('view engine', 'hbs');

	// Load Handlebars partials
	// https://github.com/donpark/hbs#helpers-and-partials
	hbs.registerPartials(app.config.express.paths.partials);

	if (filepath.create(app.config.express.paths.helpers).exists()) {
		loadHandlebarsHelpers(app.config.express.paths.helpers, app, hbs);
	}

	// Use locals in template data
	// https://github.com/donpark/hbs#exposing-locals-as-template-data
	hbs.localsAsTemplateData(app.API.express);

	// Setup the static page server
	app.API.express.use(express.static(app.config.express.paths.static));

	debug('initialized');
	return app;
};

function loadHandlebarsHelpers(path, app, hbs) {
	filepath.create(path).list().forEach(modulePath => {
		let factory;

		try {
			factory = require(modulePath.toString());
		} catch (moduleError) {
			console.error(`Error loading helper module at ${modulePath}`);
			throw moduleError;
		}

		try {
			factory(app, hbs, hbs.handlebars);
		} catch (factoryError) {
			console.error(`Error constructing helper module at ${modulePath}`);
			throw factoryError;
		}
	});
}
