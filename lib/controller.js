'use strict';

const Boom = require('boom');

const U = require('./u');

exports.create = function createController(controller) {
	return function requestHandler(req, res, next) {
		let method = req.method.toLowerCase();

		if (method === 'head') {
			method = 'get';
		}

		const handler = controller[method];

		if (U.isFunction(handler)) {
			handler.call(controller, req, res, next);
		} else {
			next(Boom.methodNotAllowed(`methodNotAllowed ${method} ${req.url}`));
		}
	};
};

exports.cleanPath = function (path) {
	path = path.replace(/index.html$/, 'index');
	return !path || (path === '/') ?
		'index' : path.replace(/^\//, '').replace(/\/$/, '');
}

exports.kebabPath = function (path) {
	return path.toLowerCase().replace(/\//, '-');
};
