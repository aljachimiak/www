'use strict';

const yaml = require('js-yaml');
const matter = require('gray-matter');
const marked = require('marked');
const filepath = require('filepath');
const boom = require('boom');

exports.load = function (path) {
	const directory = filepath.create(path);

	if (!directory.exists()) {
		return Promise.reject(boom.notFound());
	}

	if (!directory.isDirectory()) {
		return Promise.reject(new Error(
			`filepath ${directory} is not a directory`
		));
	}

	try {
		return loadPath(directory);
	} catch (err) {
		return Promise.reject(err);
	}
};

function loadPath(directory) {
	let manifest = null;
	let hasfile = null;

	const listing = directory.list();

	listing.forEach(path => {
		if (path.isFile()) {
			if (path.basename() === 'manifest.yaml') {
				manifest = readManifest(path);
			} else if (hasfile === false) {
				throw new Error(`directory ${directory} contains files and directories`);
			} else {
				hasfile = true;
			}
		} else {
			if (hasfile === true) {
				throw new Error(`directory ${directory} contains files and directories`);
			}
			hasfile = false;
		}
	});

	if (!manifest) {
		throw new Error(`missing manifest.yaml file in ${directory}`);
	}

	return manifest.then(manifestData => {
		// This is a request for a page
		if (hasfile) {
			return loadPage(manifestData, directory);
		}

		// This is a request for a directory index
		return loadDirectory(manifestData, directory);
	});
}

function readManifest(path) {
	return path.read().then(content => {
		return yaml.safeLoad(content);
	});
}

function loadPage(manifest, base) {
	if (!Array.isArray(manifest.sections)) {
		throw new Error(
			`missing "sections" Array in ${base.append('manifest.yaml')}`
		);
	}

	const page = {
		isIndex: false,
		title: manifest.title,
		description: manifest.description
	};

	const promises = manifest.sections.map(sectionName => {
		return base.append(`${sectionName}.md`).read().then(content => {
			const data = matter(content);
			return {
				name: sectionName,
				title: data.data.title,
				content: marked(data.content)
			};
		});
	});

	return Promise.all(promises).then(sections => {
		page.sections = sections;
		return page;
	});
}

function loadDirectory(manifest, base) {
	if (!Array.isArray(manifest.listing)) {
		throw new Error(
			`missing "listing" Array in ${base.append('manifest.yaml')}`
		);
	}

	const page = {
		isIndex: true,
		title: manifest.title,
		description: manifest.description
	};

	const promises = manifest.listing.map(pathname => {
		return base.append(pathname, 'manifest.yaml').read().then(content => {
			const data = yaml.safeLoad(content);
			return {
				name: pathname,
				title: data.title,
				description: data.description
			};
		});
	});

	return Promise.all(promises).then(listing => {
		page.listing = listing;
		return page;
	});
}
