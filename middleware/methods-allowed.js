'use strict';

// Params:
// config.allowed - Array of Strings
module.exports = function (config) {
	const allowed = config.allowed.map(str => {
		return str.toUpperCase();
	});

	return function methodAllowed(req, res, next) {
		const method = req.method.toUpperCase();

		if (allowed.indexOf(method) < 0) {
			res
				.status(405)
				.set('Allow', allowed.join())
				.set('Content-Type', 'text/plain')
				.send(`Method not allowed. Allowed methods: ${allowed.join()}`);
		} else {
			next();
		}
	};
};
