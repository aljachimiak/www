const errors = Object.create(null);
const util = require('util');

exports.get = function (key) {
	if (Object.prototype.hasOwnProperty.call(errors, key)) {
		return errors[key];
	}
	throw new Error(`Error type ${key} does not exist.`);
};

function OperationalError(message) {
	Error.call(this);
	Error.captureStackTrace(this, this.constructor);
	this.code = 'OperationalError';
	this.name = this.constructor.name;
	this.message = message;
}
util.inherits(OperationalError, Error);
errors.OperationalError = OperationalError;

function UnauthorizedRequestError(message) {
	Error.call(this);
	Error.captureStackTrace(this, this.constructor);
	this.code = 'UnauthorizedRequestError';
	this.name = this.constructor.name;
	this.message = message;
}
util.inherits(UnauthorizedRequestError, OperationalError);
errors.UnauthorizedRequestError = UnauthorizedRequestError;

Object.freeze(errors);
