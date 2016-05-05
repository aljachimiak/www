'use strict';

module.exports = function (app) {
	const debug = app.debug('initializeControllers');
	debug('initializing');

	const dir = app.appdir.append('controllers');

	// Load the controller modules, passing the app object into each one.
	app.API.controllers = dir.list().reduce((controllers, path) => {
		const fn = require(path.toString())(app);
		const name = fn.name || path.basename('.js');
		controllers[name] = fn;
		return controllers;
	}, Object.create(null));

	debug('initialized');
	return app;
};
