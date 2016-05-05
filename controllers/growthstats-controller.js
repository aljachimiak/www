'use strict';

module.exports = function (app) {
	return function growthStatsController(req, res, next) {
		app.API.queries.getGrowthStats()
			.then(results => {
				res.send(results);
			})
			.catch(next);
	};
};
