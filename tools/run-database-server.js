'use strict';

const Promise = require('bluebird');
const dynalite = require('dynalite');
const U = require('../lib/u');

// Dynalite
//   https://github.com/mhart/dynalite

exports.DEFAULTS = {
	port: 8000,
	path: null,
	ssl: false,
	createTableMs: 0,
	deleteTableMs: 0,
	updateTableMs: 0,
	maxItemSizeKb: 400
};

exports.main = function (options) {
	options = U.merge({}, exports.DEFAULTS, options);
	const server = dynalite(options);

	return new Promise((resolve, reject) => {
		server.listen(options.port, err => {
			if (err) {
				return reject(err);
			}

			return resolve(server);
		});
	});
};
