import { AxiosError, AxiosInstance } from 'axios';
import crypto from 'crypto';
import pino from 'pino';
import { Parser } from 'xml2js';
import { IToken } from './interfaces.js';


/**
 * Class for handling requests to the Sunny Portal API.
 * @date 15/10/2022 - 14:26:15
 *
 * @export
 * @class RequestBase
 * @typedef {RequestBase}
 */
class RequestBase {
	service: string;
	method: string;
	token: IToken | undefined;
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
	 * @param {(IToken | undefined)} token
	 * @param {number} [version=100]
	 * @param {string} [base_path='/services']
	 * @param {string} [url='']
	 */
	constructor(
		service: string,
		method: string,
		token: IToken | undefined,
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
	 * Execute the request to the Sunny Portal API.
	 * @date 21/10/2022 - 11:48:12
	 *
	 * @async
	 * @param {AxiosInstance} conn
	 * @param {string} url
	 * @returns {Promise<any>}
	 */
	async executeRequest(conn: AxiosInstance, url: string): Promise<any> {
		if (url.includes("password=")) {
			const passUrl = url.split('password=')[0] + 'password=********';
			this.logRequest.info(`${this.method} request to ${passUrl}`);
		} else {
			this.logRequest.info(`${this.method} request to ${url}`);
		}

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
	 * @returns {Promise<IToken>}
	 */
	async getToken(conn: AxiosInstance, username: string, password: string): Promise<IToken> {
		const url = this.prepareUrl([username], { password: password });
		const loginData = await this.executeRequest(conn, url);
		const token: IToken = {
			identifier: '',
			secret_key: '',
		};
		this.parser.parseString(loginData, (err: any, result: any) => {
			token.identifier = result['sma.sunnyportal.services'].service.authentication.$.identifier;
			token.secret_key = result['sma.sunnyportal.services'].service.authentication.$.key;
			this.logRequest.info('Login successful');
			this.logRequest.debug(result);
		});

		return token;
	}
}

/**
 * Class for handling logout from the sunny portal API.
 * @date 21/10/2022 - 22:06:55
 *
 * @export
 * @class LogoutRequest
 * @typedef {LogoutRequest}
 * @extends {RequestBase}
 */
export class LogoutRequest extends RequestBase {
	/**
	 * Creates an instance of LogoutRequest.
	 * @date 21/10/2022 - 17:40:26
	 *
	 * @constructor
	 * @param {string} service
	 * @param {string} method
	 * @param {*} [token=undefined]
	 */
	constructor(
		service: string,
		method: string,
		token: IToken,
	) {
		super(service, method, token);
	}

	/**
	 * Method to logout from the sunny portal API.
	 * @date 21/10/2022 - 22:08:58
	 *
	 * @async
	 * @param {AxiosInstance} conn
	 * @param {IToken} token
	 * @returns {Promise<void>}
	 */
	async logout(conn: AxiosInstance, token: IToken): Promise<void> {
		const url = this.prepareUrl([token.identifier]);
		const logoutData = await this.executeRequest(conn, url);

		this.parser.parseString(logoutData, (err: any, result: any) => {
			this.logRequest.info('Logout completed successfully');
			this.logRequest.debug(result);
		});
	}
}

/**
 * Class for retrieving the plant list from the sunny portal API.
 * @date 21/10/2022 - 22:07:40
 *
 * @export
 * @class PlantListRequest
 * @typedef {PlantListRequest}
 * @extends {RequestBase}
 */
export class PlantListRequest extends RequestBase {
	/**
	 * constructor for retrieving the plant list.
	 * @date 21/10/2022 - 17:40:26
	 *
	 * @constructor
	 * @param {string} service
	 * @param {string} method
	 * @param {*} [token=undefined]
	 */
	constructor(
		service: string,
		method: string,
		token: IToken,
	) {
		super(service, method, token);
	}


	/**
	 * Get the plant ID for the users regisered plants from the sunny portal API.
	 * @date 25/10/2022 - 14:31:39
	 *
	 * @async
	 * @param {AxiosInstance} conn
	 * @param {IToken} token
	 * @returns {Promise<any>}
	 */
	async getPlantListData(conn: AxiosInstance, token: IToken): Promise<any> {

		const url = this.prepareUrl([token.identifier]);
		const plantListData = await this.executeRequest(conn, url);

		return plantListData;
	}
}

/**
 * Class to handle te plant information request from the sunny portal API.
 * @date 22/10/2022 - 23:29:21
 *
 * @export
 * @class PlantProfileRequest
 * @typedef {PlantProfileRequest}
 * @extends {RequestBase}
 */
export class PlantProfileRequest extends RequestBase {
	getPlantDeviceListData(conn: AxiosInstance, token: IToken, plantId: string) {
		throw new Error('Method not implemented.');
	}

	/**
	 * Creates an instance of PlantProfileRequest.
	 * @date 22/10/2022 - 23:29:51
	 *
	 * @constructor
	 * @param {string} service
	 * @param {string} method
	 * @param {IToken} token
	 */
	constructor(
		service: string,
		method: string,
		token: IToken,
	) {
		super(service, method, token);
	}

	/**
	 * Methd to get tge plant data from the sunny portal API.
	 * @date 22/10/2022 - 23:30:00
	 *
	 * @async
	 * @param {AxiosInstance} conn
	 * @param {IToken} token
	 * @param {string} plantID
	 * @returns {Promise<any>}
	 */
	async getPlantData(conn: AxiosInstance, token: IToken, plantID: string): Promise<any> {
		const url = this.prepareUrl(
			[plantID],
			{
				'view': 'profile',
				"culture": "en-gb",
				"plant-image-size": "64px",
				"identifier": token.identifier
			}
		);
		const plantData = await this.executeRequest(conn, url);

		return plantData;
	}
}

/**
 * Class to handle requests for the plant device list from the sunny portal API.
 * @date 25/10/2022 - 14:00:08
 *
 * @export
 * @class PlantDeviceListRequest
 * @typedef {PlantDeviceListRequest}
 * @extends {RequestBase}
 */
export class PlantDeviceListRequest extends RequestBase {

	/**
	 * Creates an instance of PlantDeviceListRequest.
	 * @date 25/10/2022 - 14:00:36
	 *
	 * @constructor
	 * @param {string} service
	 * @param {string} method
	 * @param {IToken} token
	 */
	constructor(
		service: string,
		method: string,
		token: IToken,
	) {
		super(service, method, token);
	}

	/**
	 * Method for retrieving the plant device list data from the sunny portal API.
	 * @date 25/10/2022 - 14:00:46
	 *
	 * @async
	 * @param {AxiosInstance} conn
	 * @param {IToken} token
	 * @param {string} plantID
	 * @returns {Promise<any>}
	 */
	async getPlantDeviceListData(conn: AxiosInstance, token: IToken, plantID: string): Promise<any> {
		const url = this.prepareUrl(
			[plantID],
			{
				"identifier": token.identifier
			}
		);
		const plantDeviceListData = await this.executeRequest(conn, url);

		return plantDeviceListData;
	}
}

/**
 * Class to handle the device parameter data request to the sunny portal API.
 * @date 25/10/2022 - 14:28:20
 *
 * @export
 * @class PlantDeviceParametersRequest
 * @typedef {PlantDeviceParametersRequest}
 * @extends {RequestBase}
 */
export class PlantDeviceParametersRequest extends RequestBase {

	/**
	 * Creates an instance of PlantDeviceParametersRequest.
	 * @date 25/10/2022 - 14:28:52
	 *
	 * @constructor
	 * @param {string} service
	 * @param {string} method
	 * @param {IToken} token
	 */
	constructor(
		service: string,
		method: string,
		token: IToken,
	) {
		super(service, method, token);
	}

	/**
	 * Method to retrieve the device parameter data from the sunny portal API.
	 * @date 25/10/2022 - 14:30:00
	 *
	 * @async
	 * @param {AxiosInstance} conn
	 * @param {IToken} token
	 * @param {string} plantID
	 * @param {string} deviceID
	 * @returns {Promise<any>}
	 */
	async getPlantDeviceParametersData(conn: AxiosInstance, token: IToken, plantID: string, deviceID: string): Promise<any> {
		const url = this.prepareUrl(
			[plantID, deviceID],
			{
				"view": 'parameter',
				"identifier": token.identifier
			}
		);
		const plantDeviceParametersData = await this.executeRequest(conn, url);

		return plantDeviceParametersData;
	}
}

/**
 * Class to handle the retrieval of the last yield data from the sunny portal API.
 * @date 30/10/2022 - 16:48:49
 *
 * @export
 * @class LastDataExactRequest
 * @typedef {DataRequest}
 * @extends {RequestBase}
 */
export class DataRequest extends RequestBase {
	/**
	 * Creates an instance of LastDataExactRequest.
	 * @date 30/10/2022 - 16:49:43
	 *
	 * @constructor
	 * @param {string} service
	 * @param {string} method
	 * @param {IToken} token
	 */
	constructor(
		service: string,
		method: string,
		token: IToken,
	) {
		super(service, method, token);
	}

	/**
	 * Method to retrieve the last yield data from the sunny portal API.
	 * @date 30/10/2022 - 16:49:52
	 *
	 * @async
	 * @param {AxiosInstance} conn
	 * @param {IToken} token
	 * @param {string} plantID
	 * @param {string} date
	 * @returns {Promise<any>}
	 */
	async getLastDataExactData(conn: AxiosInstance, token: IToken, plantID: string, date: string): Promise<any> {
		const url = this.prepareUrl(
			[plantID, "Energy", date],
			{
				"culture": "en-gb",
				"identifier": token.identifier,
				"unit": "kWh",
				"view": "Lastdataexact"
			}
		);
		const lastDataExactData = await this.executeRequest(conn, url);

		return lastDataExactData;
	}

	async getAllDataRequestData(conn: AxiosInstance, token: IToken, plantID: string, date: string, interval: string): Promise<any> {
		const url = this.prepareUrl(
			[plantID, "Energy", date],
			{
				"culture": "en-gb",
				"identifier": token.identifier,
				"period": "infinite",
				"interval": interval,
				"unit": "kWh",
			}
		);
		const allDataRequestData = await this.executeRequest(conn, url);

		return allDataRequestData;
	}

	async getDayOverviewRequestData(conn: AxiosInstance, token: IToken, plantID: string, date: string, quarter = true, include_all = false): Promise<any> {
		const datatype = quarter ? "day-fifteen" : "day";
		const url = this.prepareUrl(
			[plantID, `overview-${datatype}-total`, date],
			{
				"culture": "en-gb",
				"identifier": token.identifier,
			}
		);
		const dayOverviewRequestData = await this.executeRequest(conn, url);

		return dayOverviewRequestData;

	}
}