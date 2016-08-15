'use strict';

const Promise = require('bluebird');
const request = require('request');
const U = require('../lib/u');

const BASE_URL = 'https://api.infusionsoft.com';
const OAUTH_RECORD_TYPE = 'oauth';
const OAUTH_RECORD_ID = 'infusionsoft-oauth-token';

// Infusionsoft tokens supposedly need to be refreshed every 24 hours. Since
// we're assuming a multi-node stateless system, we pick a number between
// 4 and 22 for this node.
const HOUR = 60 * 1000 * 60;
const REFRESH_RANGE_FLOOR = HOUR * 4;
const REFRESH_RANGE_CEIL = HOUR * 22;

class InfusionsoftClient {
	// spec.dynamodb
	// spec.log
	// spec.baseUrl
	// spec.clientId
	// spec.clientSecret
	// spec.redirectUri
	// spec.refreshRangeFloor
	// spec.refreshRangeCeil
	constructor(spec) {
		spec = spec || {};

		this.accessToken = null;

		this.dynamodb = spec.dynamodb;
		this.log = spec.log;

		this.BASE_URL = spec.baseUrl || BASE_URL;
		this.clientId = spec.clientId;
		this.clientSecret = spec.clientSecret;
		this.redirectUri = spec.redirectUri;
		this.refreshRangeFloor = spec.refreshRangeFloor || REFRESH_RANGE_FLOOR;
		this.refreshRangeCeil = spec.refreshRangeCeil || REFRESH_RANGE_CEIL;
	}

	static create(spec) {
		spec = spec || {};
		if (!spec.dynamodb || !U.isObject(spec.dynamodb)) {
			throw new Error('InfusionsoftClient requires a dynamodb instance');
		}
		if (!spec.log || !U.isObject(spec.log)) {
			throw new Error('InfusionsoftClient requires a log instance');
		}

		return new InfusionsoftClient(spec);
	}

	initialize() {
		return this.refreshToken();
	}

	getAccessToken() {
		return this.accessToken;
	}

	// args.code *required
	link(args) {
		return Promise.resolve(null)

			// POST credentials to get the code.
			.then(() => {
				return this.postCode(args).catch(err => {
					this.log.error(err, 'Infusionsoft postCode request failed');
					return null;
				});
			})

			// Update the database record
			.then(token => {
				if (!token) {
					return token;
				}

				const args = {
					accessToken: token.access_token,
					expiresIn: token.expires_in,
					refreshToken: token.refresh_token
				};
				return this.updateTokenRecord(args).catch(err => {
					this.log.error(err, `database failed to update ${OAUTH_RECORD_TYPE}:${OAUTH_RECORD_ID}`);
					return null;
				});
			})

			// Refresh the token again in the future before it expires.
			.then(record => {
				if (record) {
					this.log.info('infusionsoft token linked and saved');
				}

				setTimeout(() => {
					return this.refreshToken();
				}, U.random(this.refreshRangeFloor, this.refreshRangeCeil));

				return null;
			});
	}

	refreshToken() {
		return Promise.resolve(null)

			// Get the refresh token from the database
			.then(() => {
				return this.getTokenRecord().then(record => {
					this.log.info(`database got ${OAUTH_RECORD_TYPE}:${OAUTH_RECORD_ID}`);
					return record;
				}).catch(err => {
					this.log.error(err, `database failed to get ${OAUTH_RECORD_TYPE}:${OAUTH_RECORD_ID}`);
					return null;
				});
			})

			// POST the refresh token to Infusionsoft
			.then(record => {
				if (!record) {
					return record;
				}

				return this.postRefreshToken(record).catch(err => {
					this.log.error(err, 'Infusionsoft postRefreshToken request failed');
					return null;
				});
			})

			// Update the database record
			.then(token => {
				if (!token) {
					return token;
				}

				this.accessToken = token.access_token;

				const args = {
					accessToken: token.access_token,
					expiresIn: token.expires_in,
					refreshToken: token.refresh_token
				};

				return this.updateTokenRecord(args).catch(err => {
					this.log.error(err, `database failed to update ${OAUTH_RECORD_TYPE}:${OAUTH_RECORD_ID}`);
					return null;
				});
			})

			// Refresh the token again in the future before it expires.
			.then(res => {
				if (!res) {
					this.log.warn(`oauth token update failed for ${OAUTH_RECORD_TYPE}:${OAUTH_RECORD_ID}`);
					return null;
				}

				this.log.info(`oauth token updated at ${OAUTH_RECORD_TYPE}:${OAUTH_RECORD_ID}`);

				setTimeout(() => {
					return this.refreshToken();
				}, U.random(this.refreshRangeFloor, this.refreshRangeCeil));

				return null;
			});
	}

	// args.code *required
	// args.redirectUri
	// args.clientId
	// args.clientSecret
	postCode(args) {
		/* eslint-disable camelcase */
		const params = {
			form: {
				client_id: args.clientId || this.clientId,
				client_secret: args.clientSecret || this.clientSecret,
				code: args.code,
				grant_type: 'authorization_code',
				redirect_uri: args.redirectUri || this.redirectUri
			}
		};
		/* eslint-enable camelcase */

		return this.makeTokenRequest(params);
	}

	// args.refreshToken *required
	// args.clientId
	// args.clientSecret
	postRefreshToken(args) {
		const clientId = args.clientId || this.clientId;
		const clientSecret = args.clientSecret || this.clientSecret;
		const base64Creds = new Buffer(`${clientId}:${clientSecret}`).toString('base64');

		/* eslint-disable camelcase */
		const params = {
			headers: {
				Authorization: `Basic ${base64Creds}`
			},
			form: {
				grant_type: 'refresh_token',
				refresh_token: args.refreshToken
			}
		};
		/* eslint-enable camelcase */

		return this.makeTokenRequest(params);
	}

	// params.headers
	// params.form
	makeTokenRequest(params) {
		params.method = 'POST';
		params.url = params.url || `${this.BASE_URL}/token`;

		return new Promise((resolve, reject) => {
			request(params, (err, res) => {
				if (err) {
					return reject(err);
				}

				if (res.statusCode !== 200) {
					return reject(new Error(
						`${params.method} ${params.url} returned status code ${res.statusCode}`
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
	}

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

		return this.dynamodb.updateRecord(record);
	}

	getTokenRecord() {
		return this.dynamodb.getRecord(OAUTH_RECORD_TYPE, OAUTH_RECORD_ID);
	}
}

module.exports = InfusionsoftClient;
