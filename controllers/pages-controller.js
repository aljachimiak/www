'use strict';

const filepath = require('filepath');

const U = require('../lib/u');
const controller = require('../lib/controller');

class PagesController {
	constructor(app) {
		// We need to "unfreeze" the config data to make it work in the
		// Express template engine.
		this.pagedata = U.cloneDeep(app.config.pagedata);
		this.viewPath = filepath.create(app.config.express.paths.views);
	}

	get(req, res, next) {
		const path = PagesController.cleanPath(req.path);
		if (!this.viewPath.append(`${path}.hbs`).isFile()) {
			return next();
		}

		res.status(200).render(path, this.pagedata[path]);
	}

	static cleanPath(path) {
		path = path.replace(/index.html$/, 'index');
		return !path || (path === '/') ?
			'index' : path.replace(/^\//, '').replace(/\/$/, '');
	}

	static create(app) {
		return controller.create(new PagesController(app));
	}
}

module.exports = PagesController;
