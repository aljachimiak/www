'use strict';

module.exports = function (app) {
	const debug = app.debug('initializeQueries');
	debug('initializing');

	const dir = app.appdir.append('queries');

	// Load the controller modules, passing the app object into each one.
	app.API.controllers = dir.list().reduce((controllers, path) => {
		const name = path.basename('.js');
		controllers[name] = require(path.toString())(app);
		return controllers;
	}, Object.create(null));

	debug('initialized');
	return app;
};
