'use strict';

module.exports = function (app) {
	return function getStats(req, res) {
		app.API.queries.getGrowthStats().then(results => {
			res.send(results);
		});
	};
};
