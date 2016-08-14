'use strict';

const request = require('request');
const U = require('../lib/u');

const TOKEN_URL = 'https://api.infusionsoft.com/token';
const OAUTH_RECORD_TYPE = 'oauth';
const OAUTH_RECORD_ID = 'infusionsoft-oauth-token';
// Infusionsoft tokens supposedly need to be refreshed every 24 hours. Since
// we're assuming a multi-node stateless system, we pick a number between
// 4 and 22 for this node.
const HOUR = 60 * 1000 * 60;
const REFRESH_RANGE_FLOOR = HOUR * 4;
const REFRESH_RANGE_CEIL = HOUR * 22;

module.exports = function infusionsoft(app) {
	const log = app.API.log;
	const dynamodb = app.API.dynamodb;
	const config = app.config.infusionsoft;

	const infusionsoftCommands = {
		// args.code
		// args.grantType
		// args.redirectUri
		link(args) {
			return infusionsoftCommands
				.postCode(args)

				// Update the database record
				.then(token => {
					return infusionsoftCommands.updateTokenRecord({
						accessToken: token.access_token,
						expiresIn: token.expires_in,
						refreshToken: token.refresh_token
					});
				}, err => {
					// Catch this specific error for logging purposes.
					log.error(err, 'Infusionsoft postCode request failed');
					// Reject again to short circuit any remaining handlers.
					return Promise.reject(err);
				})

				.catch(err => {
					// Catch this specific error for logging purposes.
					log.error(err, `database failed to update ${OAUTH_RECORD_TYPE}:${OAUTH_RECORD_ID}`);
					// Reject again to short circuit any remaining handlers.
					return Promise.reject(err);
				})

				// Refresh the token again in the future before it expires.
				.then(() => {
					log.info('infusionsoft token linked and saved');
					setTimeout(() => {
						return infusionsoftCommands.refreshToken();
					}, U.random(REFRESH_RANGE_FLOOR, REFRESH_RANGE_CEIL));

					return null;
				});
		},

		refreshToken() {
			return infusionsoftCommands

				// Get the refresh token from the database
				.getTokenRecord()

				// POST the refresh token to Infusionsoft
				.then(record => {
					log.info(`database got ${OAUTH_RECORD_TYPE}:${OAUTH_RECORD_ID}`);
					return infusionsoftCommands.postRefreshToken(record);
				}, err => {
					// Catch this specific error for logging purposes.
					log.error(err, `database failed to get ${OAUTH_RECORD_TYPE}:${OAUTH_RECORD_ID}`);
					// Reject again to short circuit any remaining handlers.
					return Promise.reject(err);
				})

				// Update the database record
				.then(token => {
					return infusionsoftCommands.updateTokenRecord({
						accessToken: token.access_token,
						expiresIn: token.expires_in,
						refreshToken: token.refresh_token
					});
				}, err => {
					// Catch this specific error for logging purposes.
					log.error(err, 'Infusionsoft postRefreshToken request failed');
					// Reject again to short circuit any remaining handlers.
					return Promise.reject(err);
				})

				.catch(err => {
					// Catch this specific error for logging purposes.
					log.error(err, `database failed to update ${OAUTH_RECORD_TYPE}:${OAUTH_RECORD_ID}`);
					// Reject again to short circuit any remaining handlers.
					return Promise.reject(err);
				})

				// Refresh the token again in the future before it expires.
				.then(() => {
					log.info();
					setTimeout(() => {
						return infusionsoftCommands.refreshToken();
					}, U.random(REFRESH_RANGE_FLOOR, REFRESH_RANGE_CEIL));

					return null;
				});
		},

		// args.code
		// args.grantType
		// args.redirectUri
		postCode(args) {
			/* eslint-disable camelcase */
			const params = {
				method: 'POST',
				url: TOKEN_URL,
				form: {
					client_id: config.clientId,
					client_secret: config.clientSecret,
					code: args.code,
					grant_type: args.grantType,
					redirect_uri: args.redirectUri
				}
			};
			/* eslint-enable camelcase */

			return infusionsoftCommands.makeTokenRequest(params);
		},

		// args.refreshToken
		postRefreshToken(args) {
			const creds = `${config.clientId}:${config.clientSecret}`;
			const base64Creds = new Buffer(creds).toString('base64');

			/* eslint-disable camelcase */
			const params = {
				method: 'POST',
				url: TOKEN_URL,
				headers: {
					Authorization: `Basic ${base64Creds}`
				},
				form: {
					grant_type: 'refresh_token',
					refresh_token: args.refreshToken
				}
			};
			/* eslint-enable camelcase */

			return infusionsoftCommands.makeTokenRequest(params);
		},

		// params.method
		// params.url
		// params.headers
		// params.form
		makeTokenRequest(params) {
			return new Promise((resolve, reject) => {
				request(params, (err, res) => {
					if (err) {
						return reject(err);
					}

					if (res.statusCode !== 200) {
						return reject(new Error(
							`${params.method} api.infusionsoft.com/token returned status code ${res.statusCode}`
						));
					}

					let data = res.body;
					if (U.isString(res.body)) {
						try {
							data = JSON.parse(res.body);
						} catch (err) {
							return reject(new Error(
								`JSON parse error in api.infusionsoft.com/token response: ${err.message}`
							));
						}
					}

					if (!data || !U.isObject(data)) {
						return reject(new Error(
							'api.infusionsoft.com/token returned empty response'
						));
					}

					return resolve(data);
				});
			});
		},

		// data.accessToken
		// data.expiresIn
		// data.refreshToken
		updateTokenRecord(data) {
			const record = {
				type: OAUTH_RECORD_TYPE,
				id: OAUTH_RECORD_ID,
				value: data.accessToken,
				expiresIn: data.expiresIn,
				refreshToken: data.refreshToken
			};

			return dynamodb.updateRecord(record);
		},

		getTokenRecord() {
			return dynamodb.getRecord(OAUTH_RECORD_TYPE, OAUTH_RECORD_ID);
		}
	};

	return infusionsoftCommands;
};
