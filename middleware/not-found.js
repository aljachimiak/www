'use strict';

module.exports = function () {
	return function notFound(req, res) {
		res
			.status(404)
			.set('Content-Type', 'text/plain')
			.send('Page not found.');
	};
};
