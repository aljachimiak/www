'use strict';

const http = require('http');

// Requires:
// app.API.express
module.exports = function initializeServer(app) {
	const debug = app.debug('initializeServer');
	debug('initializing');

	const port = app.config.server.port;
	const host = app.config.server.host;

	const server = http.createServer(app.API.express);

	return new Promise((resolve, reject) => {
		server.on('error', err => {
			// If it is not a socket listen error, then rethrow.
			if (err.syscall !== 'listen') {
				return reject(err);
			}

			// Handle specific listen errors with friendly messages
			switch (err.code) {
				case 'EACCES':
					err = new Error(`port ${port} requires elevated privileges`);
					break;
				case 'EADDRINUSE':
					err = new Error(`port ${port} is already in use`);
					break;
				default:
					console.error('Unexpected server startup error');
			}

			reject(err);
		});

		server.on('listening', () => {
			const addr = server.address();
			debug('server listening on %s:%s', addr.address, addr.port);
			debug('initialized');
			resolve(app);
		});

		app.API.server = server;
		server.listen(port, host);
	});
};
