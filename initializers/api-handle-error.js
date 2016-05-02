'use strict';

module.exports = function (app) {
	const debug = app.debug('initializeHandleError');
	debug('initializing');

	function reportError(err) {
		app.API.log.error(err);
		if (app.environment === 'development') {
			console.error('Error Report:');
			console.error(err.stack || err.message || err);
		}
	}

	app.API.handleError = function handleError(err) {
		reportError(err);
		try {
			app.API.opbeat.captureError(err);
		} catch (opbeatError) {
			reportError(opbeatError);
		}
	};

	debug('initialized');
	return app;
};
