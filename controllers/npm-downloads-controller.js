'use strict';

module.exports = function (app) {
	return function npmDownloadsController(req, res, next) {
		app.API.queries.getNpmDownloadStats()
			.then(results => {
				res.send(results);
			})
			.catch(next);
	};
};
