'use strict';

const request = require('request');
const U = require('../lib/u');

module.exports = function infusionsoft(app) {
	const log = app.API.log;
	const CACHE = Object.create(null);

	return {
		link(args) {
			/* eslint-disable camelcase */
			const opts = {
				method: 'POST',
				url: 'https://',
				form: {
					client_id: args.clientId,
					client_secret: args.clientSecret,
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
							`api.infusionsoft.com/token returned status code ${res.statusCod}`
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

					CACHE.token = {
						value: data.access_token,
						expiresIn: data.expires_in,
						refreshToken: data.refresh_token
					};

					log.info(
						{token: {value: Boolean(data.access_token)}},
						'infusionsoft token'
					);

					return true;
				});
			});
		}
	};
};
