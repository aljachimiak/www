'use strict';

const U = require('../lib/u');

module.exports = function (options) {
	options = U.ensure(options);
	const handler = options.handler;

	return function errorHandling(err, req, res, next) {
		if (err) {
			if (U.isFunction(handler)) {
				handler(err);
			}

			res
				.status(500)
				.set('Content-Type', 'text/plain')
				.send('There was a server-side error.');
		} else {
			next();
		}
	};
};
