import axios, { AxiosInstance } from 'axios';
import pino, { Logger } from 'pino';
import { Parser } from 'xml2js';
import { Token } from './interfaces.js';
import { AuthenticationRequest, RequestBase } from './requests.js';
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
const conn = await axios.create({
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

const token = await getToken(conn, sunnyConfig.Login.email, sunnyConfig.Login.password);

// LOGOUT
const logoutRequest = new RequestBase(
	'authentication',
	'DELETE',
	token,
	100,
	'services',
);

const url = logoutRequest.prepareUrl([token.identifier]);
const logoutData = await logoutRequest.executeRequest(conn, url);

parser.parseString(logoutData, (err: any, result: any) => {
	logger.info(result);
});