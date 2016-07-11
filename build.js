'use strict';

const treadmill = require('treadmill');
const filepath = require('filepath');
const chokidar = require('chokidar');
const sass = require('node-sass');

const task = treadmill.task;

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
