'use strict';

const Promise = require('bluebird');
const moment = require('moment');
const request = require('request');

const BASE_URL = 'https://api.npmjs.org/downloads/point';

// We use oddcast as a proxy for Oddworks
const PACKAGE = 'oddcast';
const START_DATE = '2016-02-14';

module.exports = function () {
	function getNpmDownloads(start, end) {
		return new Promise((resolve, reject) => {
			const url = `${BASE_URL}/${start}:${end}/${PACKAGE}`;
			request.get(url, (err, res, body) => {
				if (err) {
					return reject(err);
				}

				let data = null;
				try {
					data = JSON.parse(body);
				} catch (jsonError) {
					return reject(jsonError);
				}

				if (data.error) {
					return resolve({
						start,
						end,
						downloads: 0
					});
				}

				resolve({
					start,
					end,
					downloads: data.downloads
				});
			});
		});
	}

	function getAllNpmDownloads(start, results) {
		const startDate = moment(start);

		const endDate = startDate.add(6, 'days');

		if (endDate.valueOf() > moment().valueOf()) {
			return results;
		}

		const end = endDate.format('YYYY-MM-DD');

		return getNpmDownloads(start, end).then(res => {
			const nextStartString = endDate.add(1, 'days').format('YYYY-MM-DD');
			results.push(res);
			res.week = results.length;
			return getAllNpmDownloads(nextStartString, results);
		});
	}

	return function getNpmDownloadStats() {
		return getAllNpmDownloads(START_DATE, []).then(res => {
			return res;
		});
	};
};
