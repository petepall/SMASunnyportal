import crypto from 'crypto';
import pino, { Logger } from 'pino';
import { Token } from './interfaces.js';


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
	token: Token;
	method: string;
	version: number;
	base_path: string;
	url: string;
	logger: Logger;

	constructor(
		service: string,
		token = {
			'secret_key': '',
			'identifier': '',
		},
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

	generateSignature(secretKey: string, method: string, service: string, timestamp: string, identifier: string) {
		return crypto.createHmac('sha1', secretKey)
			.update(method.toLowerCase())
			.update(service.toLowerCase())
			.update(timestamp)
			.update(identifier.toLowerCase())
			.digest('base64');
	}

	prepareUrl(segments: string[], params: Record<string, string> = {}): string {
		const timeStamp = this.get_timestamp();
		params.timestamp = timeStamp;
		if (this.token !== undefined) {
			const sig = this.generateSignature(this.token.secret_key, this.method, this.service, timeStamp, this.token.identifier);
			params['signature-method'] = 'auth';
			params['signature-version'] = this.version.toString();
			params.signature = sig;
		}
		this.url = `${this.base_path}/${this.service}/${this.version}`;
		this.url += segments.length > 0 ? `/${segments.join('/')}` : '';
		this.url += `?${new URLSearchParams(params)}`;
		return (this.url);

	}
}
