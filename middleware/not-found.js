'use strict';

module.exports = function (app) {
	const log = app.API.log;

	return function notFound(req, res) {
		log.warn({path: req.path}, 'page not found');
		res
			.status(404)
			.render('404');
	};
};
