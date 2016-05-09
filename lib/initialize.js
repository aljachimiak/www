'use strict';
const Promise = require('bluebird');
const filepath = require('filepath');
const U = require('./u');
const createApp = require('./app');

// Serially loads initializers and makes sure each one returns
// a promise, even if it doesn't.
//
// Params:
// initializers - Array of initializer Functions
// options.appdir - The application root directory path String
// options.environment - The environment String
module.exports = function initializer(initializers, options) {
	options = U.ensure(options);

	const appdir = U.isObject(options.appdir) ?
		options.appdir : filepath.create(options.appdir);

	const packageJSON = require(appdir.append('package.json').toString());

	const environment = options.environment;

	// Create the app Object which will get passed through
	// all the initializers
	const app = createApp({
		appdir,
		packageJSON,
		environment
	});

	// Serially load initializers, passing the app object into each one.
	return initializers.reduce((promise, init, i) => {
		return promise.then(app => {
			let val = null;
			try {
				val = init(app);
			} catch (err) {
				console.error(`Error in initializer "${init.name || i}"`);
				return Promise.reject(err);
			}

			return Promise.resolve(val).then(() => {
				return app;
			});
		});
	}, Promise.resolve(app));
};
