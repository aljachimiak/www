'use strict';

const controller = require('../lib/controller');

class InfusionsoftController {
	get(req, res) {
		console.log('%s %s', req.method, req.url);
		console.log(JSON.stringify(req.headers, null, 2));
		res.status(200).send('success');
	}

	post(req, res) {
		console.log('%s %s', req.method, req.url);
		console.log(JSON.stringify(req.headers, null, 2));
		res.status(201).send('success');
	}

	put(req, res) {
		console.log('%s %s', req.method, req.url);
		console.log(JSON.stringify(req.headers, null, 2));
		res.status(201).send('success');
	}

	static create(app) {
		return controller.create(new InfusionsoftController(app));
	}
}

module.exports = InfusionsoftController;
