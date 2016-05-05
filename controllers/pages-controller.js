'use strict';

module.exports = function () {
	return function pagesController(req, res) {
		const path = !req.path || req.path === '/' ?
			'index' : req.path.replace(/^\//, '');

		res.render(path);
	};
};
