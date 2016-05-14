'use strict';

module.exports = function (app) {
	const debug = app.debug('initializeCommands');
	debug('initializing');

	const dir = app.appdir.append('commands');

	// Load the modules, passing the app object into each one.
	app.API.commands = dir.list().reduce((commands, path) => {
		const fn = require(path.toString())(app);
		const name = fn.name || path.basename('.js');
		commands[name] = fn;
		return commands;
	}, Object.create(null));

	debug('initialized');
	return app;
};
