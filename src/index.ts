import axios, { AxiosInstance } from 'axios';
import pino, { Logger } from 'pino';
import { Parser } from 'xml2js';
import { Token } from './interfaces.js';
import { AuthenticationRequest, LogoutRequest } from './requests.js';
import {
	askForLoginData,
	checkIfFileOrPathExists,
	createFolder,
	readConfigFile,
	writeJsonFile
} from './utils.js';

// Setup the partner for turning XML into JSON.
const parser = new Parser({
	explicitArray: false,
});

// setup the logger
const logger: Logger = pino({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
	level: 'info',
});

let sunnyConfig = {
	Login: {
		email: '',
		password: '',
	},
	General: {
		baseUrl: '',
	},
};

// check if config file exists and read it.
// If not, ask for login data and create config file.
if (checkIfFileOrPathExists('./config/config.json')) {
	sunnyConfig = readConfigFile('./config/config.json');
	logger.info("config file successfully read");
} else {
	const info = askForLoginData();
	sunnyConfig.Login.email = info.email;
	sunnyConfig.Login.password = info.password;
	sunnyConfig.General.baseUrl = info.baseUrl;

	if (!checkIfFileOrPathExists('./config')) {
		createFolder('./config');
	}
	writeJsonFile('./config/config.json', sunnyConfig);
}

// Setup connection to Sunny Portal
const conn = axios.create({
	baseURL: sunnyConfig.General.baseUrl,
	timeout: 8000,
	headers: { 'Content-Type': 'application/xlm' }
});



/**
 * Authenticate with the sunny portal API and retrieve a token.
 * @date 21/10/2022 - 17:42:11
 *
 * @async
 * @param {AxiosInstance} conn
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Token>}
 */
async function getToken(conn: AxiosInstance, username: string, password: string): Promise<Token> {
	const request = new AuthenticationRequest(
		'Authentication',
		'GET'
	);
	const token = await request.getToken(conn, username, password);

	return token;
}

/**
 * Logout from the Sunny Portal API.
 * @date 21/10/2022 - 20:17:53
 *
 * @async
 * @param {AxiosInstance} conn
 * @param {Token} token
 * @returns {*}
 */
async function logout(conn: AxiosInstance, token: Token): Promise<void> {
	const request = new LogoutRequest(
		'authentication',
		'DELETE',
		token
	);
	await request.logout(conn, token);
}

const token = await getToken(conn, sunnyConfig.Login.email, sunnyConfig.Login.password);

logout(conn, token);
