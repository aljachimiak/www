'use strict';
const SEP = require('path').sep;

const contentLoader = require('../lib/content-loader');

module.exports = function (app) {
	const basepath = app.appdir.append('content');

	return function documentationController(req, res, next) {
		// Normalize and resolve the URL path to the file system
		const path = basepath.append(
			req.path.replace(/\//g, SEP).replace(/\.json$/, '')
		);

		contentLoader.load(path)
			.then(data => {
				if (data.isIndex && !/\/$/.test(req.path)) {
					// Redirect (moved permanently) to the "/" url.
					res.redirect(301, `${req.path}/`);
				} else if (/\.json$/.test(req.path)) {
					// If .json is used on a request path,
					// then send back the content data as JSON
					res.send(data);
				} else {
					// Render views/documentation
					res.render('documentation', data);
				}
			})
			.catch(err => {
				if (err && err.message === 'Not Found') {
					next();
				} else {
					next(err);
				}
			});
	};
};
