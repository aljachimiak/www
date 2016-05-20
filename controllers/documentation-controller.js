'use strict';
const SEP = require('path').sep;

const contentLoader = require('../lib/content-loader');

module.exports = function (app) {
	const handleError = app.API.handleError;
	const basepath = app.appdir.append('content');

	return function documentationController(req, res, next) {
		// Normalize and resolve the URL path to the file system
		const path = basepath.append(req.path.replace(/\//g, SEP));

		contentLoader.load(path)
			.then(data => {
				if (/\.json$/.test(req.path)) {
					// If .json is used on a request path,
					// then send back the content data as JSON
					res.send(data);
				} else {
					// Render views/documentation
					res.render('documentation', data);
				}
			})
			.catch(next);
	};
};
