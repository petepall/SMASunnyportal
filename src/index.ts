import axios, { AxiosInstance } from 'axios';
import pino, { Logger } from 'pino';
import { Parser } from 'xml2js';
import { IPlantList, IPlantProfile, ISunnyConfig, IToken } from './interfaces.js';
import { AuthenticationRequest, LastDataExactRequest, LogoutRequest, PlantDeviceListRequest, PlantDeviceParametersRequest, PlantListRequest, PlantProfileRequest } from './requests.js';
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
 * Retrieve the list of plants and return the plant id and name as object.
 * @date 21/10/2022 - 22:02:48
 *
 * @async
 * @param {AxiosInstance} conn
 * @param {IToken} token
 * @returns {Promise<any>}
 */
async function getJSONPlantList(conn: AxiosInstance, token: IToken): Promise<IPlantList> {
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

/**
 * Retrieve the plant information based on the plantID and return the data as a JSON object.
 * @date 23/10/2022 - 17:13:59
 *
 * @async
 * @param {AxiosInstance} conn
 * @param {IToken} token
 * @param {string} plantId
 * @returns {Promise<any>}
 */
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

/**
 * Retrieve the list of devices for a plant and return the device list as a JSON object.
 * @date 25/10/2022 - 14:40:38
 *
 * @async
 * @param {AxiosInstance} conn
 * @param {IToken} token
 * @param {string} plantId
 * @returns {Promise<any>}
 */
async function getJSONPlantDeviceListData(conn: AxiosInstance, token: IToken, plantId: string): Promise<any> {
	const request = new PlantDeviceListRequest(
		'device',
		'GET',
		token
	);
	const plantDeviceListData = await request.getPlantDeviceListData(conn, token, plantId);

	let data = null;
	parser.parseString(plantDeviceListData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'].service.devicelist;
		logger.debug(data);
	});

	return data;
}

/**
 * Retrieve the device parameters for a given deviceID and return the device parameters as a JSON object.
 * @date 25/10/2022 - 14:41:50
 *
 * @async
 * @param {AxiosInstance} conn
 * @param {IToken} token
 * @param {string} plantId
 * @param {string} deviceId
 * @returns {Promise<any>}
 */
async function getJSONPlantDeviceParameterData(conn: AxiosInstance, token: IToken, plantId: string, deviceId: string): Promise<any> {
	const request = new PlantDeviceParametersRequest(
		'device',
		'GET',
		token
	);
	const plantDeviceParameterData = await request.getPlantDeviceParametersData(conn, token, plantId, deviceId);

	let data = null;
	parser.parseString(plantDeviceParameterData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'];
		logger.debug(data);
	});

	return data;
}

async function getJSONLastDataExactData(conn: AxiosInstance, token: IToken, plantID: string, date: string): Promise<any> {
	const request = new LastDataExactRequest(
		'data',
		'GET',
		token
	);
	const lastDataExactData = await request.getLastDataExactData(conn, token, plantID, date);

	let data = null;
	parser.parseString(lastDataExactData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'];
		logger.debug(data);
	});

	return data;
}

/*
 * Main program execution.
*/
let sunnyConfig: ISunnyConfig = {
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
for (const key in inverters.inverter) {
	const details = [];
	if (inverters.inverter.length === undefined) {
		if (key === '$') {
			for (const inverterKey in inverters.inverter[key]) {
				details.push(inverters.inverter[key][inverterKey]);
			}
			plantProfile.inverters[key] = {
				inverterName: inverters.inverter._,
				numberOfInverters: details[0],
				icon: details[1],
			};
		}
	} else {
		for (const inverterKey in inverters.inverter[key].$) {
			details.push(inverters.inverter[key].$[inverterKey]);
		}
		plantProfile.inverters[key] = {
			inverterName: inverters.inverter[key]._,
			numberOfInverters: details[0],
			icon: details[1],
		};
	}
}

const communicationProducts = plantData.communicationProducts;
for (const key in communicationProducts.communicationProduct) {
	const details = [];
	if (communicationProducts.communicationProduct.length === undefined) {
		if (key === '$') {
			for (const communicationsKey in communicationProducts.communicationProduct[key]) {
				details.push(communicationProducts.communicationProduct[key][communicationsKey]);
			}
			plantProfile.communicationProducts[key] = {
				communicationProductName: communicationProducts.communicationProduct._,
				numberOfCommunicationProducts: details[0],
				icon: details[1],
			};
		}
	} else {
		for (const communicationsKey in communicationProducts.communicationProduct[key].$) {
			details.push(communicationProducts.communicationProduct[key].$[communicationsKey]);
		}
		plantProfile.communicationProducts[key] = {
			communicationProductName: communicationProducts.communicationProduct[key]._,
			numberOfCommunicationProducts: details[0],
			icon: details[1],
		};
	}
}
// console.log(plantProfile);

const plantDeviceListData = await getJSONPlantDeviceListData(conn, token, plantoid);
// console.log(plantDeviceListData);

const plantDeviceParameterData = await getJSONPlantDeviceParameterData(conn, token, plantoid, plantDeviceListData.device[0].$.oid);
// for (const key in plantDeviceParameterData.service.parameterlist.parameter) {
// 	console.log(plantDeviceParameterData.service.parameterlist.parameter[key]);
// }

const lastDataExactData = await getJSONLastDataExactData(conn, token, plantoid, '2022-10-30');
// for (const key in lastDataExactData.service.data.Energy) {
// 	console.log(lastDataExactData.service.data.Energy[key]);
// }

logout(conn, token);
