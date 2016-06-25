'use strict';

const url = require('url');

const U = require('../lib/u');

module.exports = function (configs) {
	return function cacheControl(req, res, next) {
		const path = url.parse(req.url).pathname;

		let i = 0;
		for (i; i < configs.length; i += 1) {
			const config = configs[i];
			if (config.pattern.test(path)) {
				if (config.headers.Expires && U.isNumber(config.headers.Expires)) {
					config.headers.Expires = new Date(
						Date.now() + (config.headers.Expires * 1000)
					).toUTCString();
				}
				res.set(config.headers);
				return next();
			}
		}

		next();
	};
};
