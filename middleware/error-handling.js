'use strict';

const U = require('../lib/u');

module.exports = function (options) {
	options = options || {};
	const handler = options.handler;

	function shouldReportError(err) {
		if (U.isFunction(handler)) {
			if (err && err.output && err.output.statusCode < 500) {
				return false;
			}
			return true;
		}
		return false;
	}

	return function errorHandler(err, req, res, next) {
		if (err) {
			// We treat Boom errors specially
			// https://github.com/hapijs/boom

			if (shouldReportError(err)) {
				handler(err, req);
			}

			res
				.status(err.isBoom ? err.output.statusCode : 500)
				.set('Content-Type', 'text/plain')
				.send('there was a server error');
		} else {
			next();
		}
	};
};
