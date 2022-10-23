import axios, { AxiosInstance } from 'axios';
import pino, { Logger } from 'pino';
import { Parser } from 'xml2js';
import { IPlantList, IPlantProfile, IToken } from './interfaces.js';
import { AuthenticationRequest, LogoutRequest, PlantListRequest, PlantProfileRequest } from './requests.js';
import {
	askForLoginData,
	checkIfFileOrPathExists,
	createFolder,
	readConfigFile,
	writeJsonFile
} from './utils.js';

// Setup the parser for turning XML into JSON.
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
 * @returns {Promise<IToken>}
 */
async function getToken(conn: AxiosInstance, username: string, password: string): Promise<IToken> {
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
 * @param {IToken} token
 * @returns {*}
 */
async function logout(conn: AxiosInstance, token: IToken): Promise<void> {
	const request = new LogoutRequest(
		'authentication',
		'DELETE',
		token
	);
	await request.logout(conn, token);
}

/**
 * Retrieve the list of plants from the Sunny Portal API.
 * @date 21/10/2022 - 22:02:48
 *
 * @async
 * @param {AxiosInstance} conn
 * @param {IToken} token
 * @returns {Promise<any>}
 */
async function getJSONPlantList(conn: AxiosInstance, token: IToken): Promise<any> {
	const request = new PlantListRequest(
		'plantlist',
		'GET',
		token
	);
	const plantList: IPlantList = {
		plantname: '',
		plantoid: '',
	};
	const parsePlantListData = await request.getPlantListData(conn, token);
	parser.parseString(parsePlantListData, (err: any, result: any) => {
		plantList.plantname = result['sma.sunnyportal.services'].service.plantlist.plant.$.name;
		plantList.plantoid = result['sma.sunnyportal.services'].service.plantlist.plant.$.oid;
		logger.debug(plantList);
	});
	return plantList;
}

async function getJSONPlantData(conn: AxiosInstance, token: IToken, plantId: string): Promise<any> {
	const request = new PlantProfileRequest(
		'plant',
		'GET',
		token
	);
	const plantData = await request.getPlantData(conn, token, plantId);

	let data = null;
	parser.parseString(plantData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'].service.plant;
		logger.debug(data);
	});

	return data;
}

const token = await getToken(conn, sunnyConfig.Login.email, sunnyConfig.Login.password);
const plantlist = await getJSONPlantList(conn, token);
const plantoid = plantlist.plantoid;
const plantData = await getJSONPlantData(conn, token, plantoid);

const plantProfile: IPlantProfile = {
	plantHeader: {
	},
	expectedPlantProduction: {
	},
	modules: {
	},
	inverters: {
	},
	communicationProducts: {
	},
};

const inverters = plantData.inverters;
console.log(inverters.inverter);
for (const key in inverters.inverter) {
	const details = [];
	for (const inverterKey in inverters.inverter[key].$) {
		details.push(inverters.inverter[key].$[inverterKey]);
	}
	plantProfile.inverters[key] = {
		inverterName: inverters.inverter[key]._,
		numberOfInverters: details[0],
		icon: details[1],
	};
}
console.log(plantProfile);

logout(conn, token);
