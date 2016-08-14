'use strict';

const DynamoDBEngine = require('dynamodb-engine');

module.exports = function initializeApiDynamoDb(app) {
	const config = app.config.dynamodb;
	const schema = app.config.dynamodbSchema;

	app.API.dynamodb = DynamoDBEngine.create(config, schema);
};
