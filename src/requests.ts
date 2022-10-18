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
	 * Get the timestamp for the request based on UTC time.
	 * @date 17/10/2022 - 12:06:19
	 *
	 * @returns {string}
	 */
	get_timestamp(): string {
		return new Date().toISOString().slice(0, 19);
	}


	/**
	 * Method for generating logging messages for the request.
	 * @date 17/10/2022 - 12:07:03
	 *
	 * @param {string} method
	 * @param {string} url
	 */
	log_request(method: string, url: string): void {
		this.logger.info(`${method} ${url}`);
	}

	/**
	 * Generate the security signature for the request.
	 * @date 17/10/2022 - 12:07:18
	 *
	 * @param {string} secretKey
	 * @param {string} method
	 * @param {string} service
	 * @param {string} timestamp
	 * @param {string} identifier
	 * @returns {string}
	 */
	generateSignature(secretKey: string, method: string, service: string, timestamp: string, identifier: string): string {
		return encodeURIComponent(crypto.createHmac('sha1', secretKey)
			.update(method.toLowerCase())
			.update(service.toLowerCase())
			.update(timestamp)
			.update(identifier.toLowerCase())
			.digest('base64'));
	}

	/**
	 * Prepare the url for the request based on given segments and params.
	 * @date 17/10/2022 - 12:07:39
	 *
	 * @param {string[]} segments
	 * @param {Record<string, string>} [params={}]
	 * @returns {string}
	 */
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
		return this.url;

	}
}
