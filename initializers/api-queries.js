'use strict';

module.exports = function (app) {
	const debug = app.debug('initializeQueries');
	debug('initializing');

	const dir = app.appdir.append('queries');

	// Load the controller modules, passing the app object into each one.
	app.API.queries = dir.list().reduce((queries, path) => {
		const fn = require(path.toString())(app);
		const name = fn.name || path.basename('.js');
		queries[name] = fn;
		return queries;
	}, Object.create(null));

	debug('initialized');
	return app;
};
