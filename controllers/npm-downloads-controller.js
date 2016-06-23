'use strict';

const controller = require('../lib/controller');

class NPMDownloadsController {
	constructor(app) {
		this.app = app;
	}

	get(req, res, next) {
		const responseType = req.params.type;

		this.app.API.queries.getNpmDownloadStats()
			.then(results => {
				let body;

				switch (responseType) {
					case 'json':
						res.send(results);
						break;
					case 'csv':
						body = 'week,start,end,downloads';

						results.forEach(res => {
							body += '\n';
							body += [res.week, res.start, res.end, res.downloads].join(',');
						});

						res
							.set('Content-Type', 'text/plain')
							.send(body);
						break;
					default:
						res.render('growthstats/npm_downloads', {results});
				}
			})
			.catch(next);
	}

	static create(app) {
		return controller.create(new NPMDownloadsController(app));
	}
}

module.exports = NPMDownloadsController;
