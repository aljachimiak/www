'use strict';

module.exports = function (app) {
	const log = app.API.log;
	const regex = /^\/assets/;
	return function accessLogMiddleware(req, res, next) {
		if (!regex.test(req.url)) {
			// Log Google utm_ tracking tags
			const info = Object.keys(req.query).reduce((info, key) => {
				if (key.slice(0, 3) === 'utm') {
					info[key] = req.query[key];
				}
				return info;
			}, {method: req.method, path: req.path});

			log.info({req: info}, 'page request');
		}
		next();
	};
};
