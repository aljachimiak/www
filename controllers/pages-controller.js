'use strict';

const U = require('../lib/u');

module.exports = function (app) {
	// We need to "unfreeze" the config data to make it work in the
	// Express template engine.
	const pagedata = U.cloneDeep(app.config.pagedata);

	return function pagesController(req, res) {
		const path = !req.path || req.path === '/' ?
			'index' : req.path.replace(/^\//, '').replace(/\/$/, '');

		res.render(path, pagedata[path]);
	};
};
