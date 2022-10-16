import crypto from 'crypto';
import pino, { Logger } from 'pino';

/**
 * Class for handling requests to the Sunny Portal API.
 * @date 15/10/2022 - 14:26:15
 *
 * @export
 * @class RequestBase
 * @typedef {RequestBase}
 */
export class RequestBase {
	service: string;
	token: object;
	method: string;
	version: number;
	base_path: string;
	url: string;
	logger: Logger;

	constructor(
		service: string,
		token = {},
		method = 'GET',
		version = 100,
		base_path = '/services',
		url = '',
		logger = pino({
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: true,
				},
			},
			level: 'info',
		}),
	) {
		this.service = service;
		this.token = token;
		this.method = method;
		this.version = version;
		this.base_path = base_path;
		this.url = url;
		this.logger = logger;
	}

	/**
	 * Method for determining the timestamp for the request.
	 * @date 15/10/2022 - 14:25:29
	 *
	 * @param {number} [offset=0]
	 * @returns {*}
	 */
	get_timestamp(offset = 0) {
		const date = new Date();
		const offsetDate = date.setDate(date.getDate() - offset);
		return new Date(offsetDate).toISOString().slice(0, 19);
	}

	/**
	 * Method for generating logging messages for the request.
	 * @date 15/10/2022 - 14:25:29
	 *
	 * @param {string} method
	 * @param {string} url
	 */
	log_request(method: string, url: string) {
		this.logger.info(`${method} ${url}`);
	}

	prepare_url(segments: string[], params: object) {
		if (!this.token) {
			const timeStamp = this.get_timestamp(this.token.server_offset);
			const encoded = crypto.createHmac('sha1', key)
				.update(this.method.toLowerCase())
				.update(this.service.toLowerCase())
				.update(timeStamp)
				.update(this.token.identifier.toLowerCase())
				.digest('base64');
		}
	}
}
