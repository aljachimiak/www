'use strict';
const debug = require('debug');
const U = require('./u');

// spec.appdir
// spec.packageJSON
// spec.environment
// spec.name (default=spec.packageJSON.name)
// spec.config (default={})
// spec.argv (default={})
module.exports = function (spec) {
	const app = Object.create(null);
	const packageJSON = spec.packageJSON;
	const name = spec.name || packageJSON.name;

	Object.defineProperties(app, {
		name: {
			enumerable: true,
			value: name
		},
		version: {
			enumerable: true,
			value: spec.version || packageJSON.version
		},
		appdir: {
			enumerable: true,
			value: spec.appdir
		},
		packageJSON: {
			enumerable: true,
			value: U.deepFreeze(packageJSON)
		},
		environment: {
			enumerable: true,
			value: spec.environment
		},
		config: {
			enumerable: true,
			value: U.extend(Object.create(null), U.ensure(spec.configs))
		},
		argv: {
			enumerable: true,
			value: U.deepFreeze(U.ensure(spec.argv))
		},
		debug: {
			enumerable: true,
			value(modname) {
				return debug(`${name}:${modname}`);
			}
		},
		API: {
			enumerable: true,
			value: Object.create(null)
		}
	});

	return app;
};
