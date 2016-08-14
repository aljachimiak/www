'use strict';

const request = require('request');
const U = require('../lib/u');

const TOKEN_URL = 'https://api.infusionsoft.com/token';
const OAUTH_RECORD_TYPE = 'oauth';
const OAUTH_RECORD_ID = 'infusionsoft-oauth-token';

module.exports = function infusionsoft(app) {
	const log = app.API.log;
	const dynamodb = app.API.dynamodb;
	const config = app.config.infusionsoft;

	const infusionsoftCommands = {
		// args.code
		// args.grant_type
		// args.redirect_url
		link(args) {
			/* eslint-disable camelcase */
			const opts = {
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

			return new Promise((resolve, reject) => {
				request(opts, (err, res) => {
					if (err) {
						return reject(err);
					}

					if (res.statusCode !== 200) {
						return reject(new Error(
							`api.infusionsoft.com/token returned status code ${res.statusCode}`
						));
					}

					// "access_token": "drwgbbq4snaas3khpxmvugy7",
					// "token_type": "bearer",
					// "expires_in": 86400,
					// "refresh_token": "4ugt7p9xskg76k7v4jxhazz4",
					// "scope": "full|wo321.infusionsoft.com"

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

					const record = {
						type: OAUTH_RECORD_TYPE,
						id: OAUTH_RECORD_ID,
						value: data.access_token,
						expiresIn: data.expires_in,
						refreshToken: data.refresh_token
					};

					dynamodb.updateRecord(record)
						.then(() => {
							log.info(
								{token: {value: Boolean(data.access_token)}},
								'infusionsoft token'
							);
						})
						.catch(err => {
							log.error(err, `dynamodb updateRecord error for ${record.id}`);
						});

					setTimeout(() => {
						return dynamodb.getRecord(OAUTH_RECORD_TYPE, OAUTH_RECORD_ID)
							.then(record => {
								return infusionsoftCommands.refreshToken(record);
							}, err => {
								log.error(err, `dynamodb getRecord error for ${record.id}`);
								return null;
							})
							.catch(err => {
								log.error(err, 'infusionsoft refresh_token error');
								return null;
							});
					}, 10000);

					resolve(true);
				});
			});
		},

		refreshToken(args) {
			const creds = `${config.clientId}:${config.clientSecret}`;
			creds = new Buffer(creds).toString('base64');

			/* eslint-disable camelcase */
			const opts = {
				method: 'POST',
				url: TOKEN_URL,
				headers: {
					Authorization: `Basic ${creds}`
				},
				form: {
					grant_type: 'refresh_token',
					refresh_token: args.refreshToken
				}
			};
			/* eslint-enable camelcase */

			return new Promise((resolve, reject) => {
				request(opts, (err, res) => {
					if (err) {
						return reject(err);
					}

					if (res.statusCode !== 200) {
						return reject(new Error(
							`api.infusionsoft.com/token returned status code ${res.statusCode}`
						));
					}

					// "access_token": "drwgbbq4snaas3khpxmvugy7",
					// "token_type": "bearer",
					// "expires_in": 86400,
					// "refresh_token": "4ugt7p9xskg76k7v4jxhazz4",
					// "scope": "full|wo321.infusionsoft.com"

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

					console.log('DATA');
					console.log(data);

					if (!data || !U.isObject(data)) {
						return reject(new Error(
							'api.infusionsoft.com/token returned empty response'
						));
					}
				});
			});
		}
	};

	return infusionsoftCommands;
};
