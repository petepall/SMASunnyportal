import axios, { AxiosError, AxiosInstance } from 'axios';
import crypto from 'crypto';
import pino from 'pino';
import { Parser } from 'xml2js';
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
	method: string;
	token: Token | undefined;
	version: number;
	base_path: string;
	url: string;


	/**
	 * Creates an instance of RequestBase.
	 * @date 21/10/2022 - 17:13:43
	 *
	 * @constructor
	 * @param {string} service
	 * @param {string} method
	 * @param {(Token | undefined)} token
	 * @param {number} [version=100]
	 * @param {string} [base_path='/services']
	 * @param {string} [url='']
	 */
	constructor(
		service: string,
		method: string,
		token: Token | undefined,
		version = 100,
		base_path = '/services',
		url = '',
	) {
		this.service = service;
		this.method = method;
		this.token = token;
		this.version = version;
		this.base_path = base_path;
		this.url = url;
	}

	/**
	 * Logger setup for the request class.
	 * @date 19/10/2022 - 17:36:41
	 *
	 * @type {*}
	 */
	logRequest = pino({
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
			},
		},
		level: 'info',
	});

	parser = new Parser({
		explicitArray: false,
	});

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
	generateSignature(
		secretKey: string,
		method: string,
		service: string,
		timestamp: string,
		identifier: string
	): string {
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
		if (this.token !== undefined) {
			const timeStamp = this.get_timestamp();
			params.timestamp = timeStamp;
			const sig = this.generateSignature(
				this.token.secret_key,
				this.method,
				this.service,
				timeStamp, this.token.identifier
			);
			params['signature-method'] = 'auth';
			params['signature-version'] = this.version.toString();
			params.signature = sig;
		}
		this.url = `${this.base_path}/${this.service}/${this.version}`;
		this.url += segments.length > 0 ? `/${segments.join('/')}` : '';
		this.url += `?${new URLSearchParams(params)}`;
		return this.url;

	}

	/**
	 * Open the axios connection to the Sunny Portal API.
	 * @date 21/10/2022 - 11:48:07
	 *
	 * @async
	 * @param {string} baseUrl
	 * @returns {unknown}
	 */
	async createConnection(baseUrl: string) {
		const instance = await axios.create({
			baseURL: baseUrl,
			timeout: 8000,
			headers: { 'Content-Type': 'application/xlm' }
		});

		return instance;
	}

	/**
	 * Execute the request to the Sunny Portal API.
	 * @date 21/10/2022 - 11:48:12
	 *
	 * @async
	 * @param {AxiosInstance} conn
	 * @param {string} url
	 * @returns {Promise<any>}
	 */
	async executeRequest(conn: AxiosInstance, url: string): Promise<any> {
		this.logRequest.info(`${this.method} request to ${url}`);

		try {
			const data = await conn({
				method: this.method,
				url: url,
			});
			return await data.data;
		} catch (error) {
			const err = error as AxiosError;
			this.logRequest.debug(err.response?.data);
			return err.response;
		}
	}
}

/**
 * Authenticate with the sunny portal API and retrieve a token.
 * @date 21/10/2022 - 17:39:53
 *
 * @export
 * @class AuthenticationRequest
 * @typedef {AuthenticationRequest}
 * @extends {RequestBase}
 */
export class AuthenticationRequest extends RequestBase {
	username: string;
	password: string;
	/**
	 * Creates an instance of AuthenticationRequest.
	 * @date 21/10/2022 - 17:40:26
	 *
	 * @constructor
	 * @param {string} service
	 * @param {string} method
	 * @param {string} [username='']
	 * @param {string} [password='']
	 * @param {*} [token=undefined]
	 */
	constructor(
		service: string,
		method: string,
		username = '',
		password = '',
		token = undefined,
	) {
		super(service, method, token);
		this.username = username;
		this.password = password;
	}

	/**
	 * Get the token from the sunny portal API.
	 * @date 21/10/2022 - 17:40:35
	 *
	 * @async
	 * @param {AxiosInstance} conn
	 * @param {string} username
	 * @param {string} password
	 * @returns {Promise<Token>}
	 */
	async getToken(conn: AxiosInstance, username: string, password: string): Promise<Token> {
		const url = this.prepareUrl([username], { password: password });
		const loginData = await this.executeRequest(conn, url);
		const token: Token = {
			identifier: '',
			secret_key: '',
		};
		this.parser.parseString(loginData, (err: any, result: any) => {
			token.identifier = result['sma.sunnyportal.services'].service.authentication.$.identifier;
			token.secret_key = result['sma.sunnyportal.services'].service.authentication.$.key;
			this.logRequest.debug(result);
		});

		return token;
	}

}