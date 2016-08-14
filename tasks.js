'use strict';

// Set environment vars first
require('dotenv').config();

const treadmill = require('treadmill');
const filepath = require('filepath');
const chokidar = require('chokidar');
const sass = require('node-sass');
const initialize = require('./lib/initialize');
const runDatabaseServer = require('./tools/run-database-server');
const server = require('./server');

const task = treadmill.task;
const log = treadmill.logger;
const env = process.env.NODE_ENV || 'development';

const APPDIR = filepath.create(__dirname);

task('css', (args, done) => {
	buildCSS(done);
});

task('watch-css', ['css'], () => {
	const dir = APPDIR.append('css');
	chokidar.watch(dir.toString()).on('all', () => {
		buildCSS(() => {
			console.log('css rebuilt %s', new Date().toLocaleString());
		});
	});
});

// Creates the "app" object (./lib/app.js) which will be available to other
// tasks via `args.get('app')`.
task('app', () => {
	const options = {
		appdir: __dirname,
		environment: env
	};

	const initializers = [
		require('./initializers/config'),
		require('./initializers/api-log'),
		require('./initializers/api-handle-error'),
		require('./initializers/api-dynamodb'),
		require('./initializers/api-queries'),
		require('./initializers/api-commands')
	];

	return initialize(initializers, options);
});

// Start the local Dynalite DB server.
// The server will be available at `args.get('db')`.
task('db-run', ['app'], args => {
	const app = args.get('app');

	const options = {
		path: app.appdir.append('data').toString()
	};

	return runDatabaseServer.main(options).then(server => {
		const addr = server.address();
		const address = `http://${addr.address}:${addr.port}`;
		log(`Dynalite server successfully started at ${address}`);
		log('Stop the server with ctrl-c');
		return server;
	});
});

// Run the database migrations locally.
task('db-migrate', ['app', 'db-run'], args => {
	const app = args.get('app');
	const dbServer = args.get('db-run');

	return app.API.dynamodb.migrateUp().then(res => {
		// Close the database server so we don't get a hung process.
		dbServer.close();
		return res;
	});
});

// Clean out the DB files for a fresh start
task('db-clean', ['app'], args => {
	const app = args.get('app');
	app.appdir.append('data').list().forEach(file => {
		if (file.basename !== '.gitkeep') {
			file.remove();
			log(`db-clean removed ${file}`);
		}
	});

	return Promise.resolve(true);
});

// Run the Dynalite DB and Express App server in a single process.
task('dev-db-server', ['db-run'], () => {
	return server.main().then(app => {
		const addr = app.API.server.address();
		log('API server successfully started in development mode.');
		log(`Point your HTTP client to http://${addr.address}:${addr.port}`);
		log('Press CTRL-c to quit');
	})
	.catch(err => {
		console.error('API server failed to start.');
		console.error('main execution error');
		console.error(err.stack || err.message || err);
	});
});

function buildCSS(done) {
	const src = APPDIR.append('css', 'main.scss');
	const dest = APPDIR.append('public', 'assets', 'css', 'main.css');

	const options = {
		file: src.toString(),
		outputStyle: 'compressed' // nested, expanded, compact, compressed
	};

	sass.render(options, (err, res) => {
		if (err) {
			console.error(err.stack);
			done(err);
		} else {
			dest.write(res.css).then(() => {
				done();
			}, done);
		}
	});
}
