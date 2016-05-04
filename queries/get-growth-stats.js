'use strict';

const moment = require('moment');
const request = require('request');

module.exports = function (app) {

	function getNpmDownloads(start, end) {
	}

	function getAllNpmDownloads(start, end, results) {
		return getNpmDownloads().then(res => {
			const nextStartDate = moment(end).add(1, 'days');
			const nextStart = nextStartDate.format('YYYY-MM-DD');

			const nextEndDate = nextStartDate.add(6, 'days');
			if (moment().valueOf() > nextEndDate.valueOf()) {
				return results;
			}

			const nextEnd = nextEndDate.format('YYYY-MM-DD');

			return getAllNpmDownloads(nextStart, nextEnd, res);
		});
	}

	return function getGrowthStats() {
	};
};
