'use strict';

// This module simply adds some mixins to Lodash and exports it.

const lodash = require('lodash');
const brixx = require('brixx');

function isFullString(str) {
	return str && typeof str === 'string';
}

lodash.mixin({
	ensure: brixx.ensure,
	deepFreeze: brixx.deepFreeze,
	exists: brixx.exists,
	stringify: brixx.stringify,
	isFullString: isFullString
});

module.exports = lodash;
