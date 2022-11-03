import axios from 'axios';
import { Parser } from 'xml2js';
import { IPlantList, IPlantProfile, ISunnyConfig, IToken } from './interfaces';
import logger from './logger/index.js';
import { AuthenticationRequest, DataRequest, LogoutRequest, PlantDeviceListRequest, PlantDeviceParametersRequest, PlantListRequest, PlantProfileRequest } from './requests.js';
import {
	askForLoginData,
	checkIfFileOrPathExists,
	createFolder,
	getFirstDayOfTheMonth,
	readConfigFile,
	writeJsonFile
} from './utils.js';

// Setup the parser for turning XML into JSON.
const parser = new Parser({
	explicitArray: false,
});

/**
 * Function to authenticate with the sunny portal API and retrieve a token.
 * @date 21/10/2022 - 17:42:11
 *
 * @async
 * @param {AxiosInstance} conn
 * @param {string} username
 * @param {string} password
 * @returns {Promise<IToken>}
 */
async function getToken(username: string, password: string): Promise<IToken> {
	const request = new AuthenticationRequest(
		'Authentication',
		'GET',
		conn
	);
	const token = await request.getToken(username, password);

	return token;
}

/**
 * Function to logout from the Sunny Portal API.
 * @date 21/10/2022 - 20:17:53
 *
 * @async
 * @param {AxiosInstance} conn
 * @param {IToken} token
 * @returns {*}
 */
async function logout(): Promise<void> {
	const request = new LogoutRequest(
		'authentication',
		'DELETE',
		conn,
		token
	);
	await request.logout();
}

/**
 * Function to retrieve the list of plants and return the plant id and name as object.
 * @date 01/11/2022 - 13:38:26
 *
 * @async
 * @returns {Promise<IPlantList>}
 */
async function parseJSONPlantList(): Promise<IPlantList> {
	const request = new PlantListRequest(
		'plantlist',
		'GET',
		conn,
		token
	);
	const plantList: IPlantList = {
		plantname: '',
		plantoid: '',
	};
	const parsePlantListData = await request.getPlantListData();
	parser.parseString(parsePlantListData, (err: any, result: any) => {
		plantList.plantname = result['sma.sunnyportal.services'].service.plantlist.plant.$.name;
		plantList.plantoid = result['sma.sunnyportal.services'].service.plantlist.plant.$.oid;
		logger.debug(plantList);
	});
	return plantList;
}

/**
 * Function to retrieve the plant information based on the plantID and return the data as a JSON object.
 * @date 01/11/2022 - 13:38:50
 *
 * @async
 * @param {string} plantId
 * @returns {Promise<any>}
 */
async function parseJSONPlantData(plantId: string): Promise<any> {
	const request = new PlantProfileRequest(
		'plant',
		'GET',
		conn,
		token
	);
	const plantData = await request.getPlantData(plantId);

	let data = null;
	parser.parseString(plantData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'].service.plant;
		logger.debug(data);
	});

	return data;
}

/**
 * Function to retrieve the list of devices for a plant and return the device list as a JSON object.
 * @date 01/11/2022 - 13:39:08
 *
 * @async
 * @param {string} plantId
 * @returns {Promise<any>}
 */
async function parseJSONPlantDeviceListData(plantId: string): Promise<any> {
	const request = new PlantDeviceListRequest(
		'device',
		'GET',
		conn,
		token
	);
	const plantDeviceListData = await request.getPlantDeviceListData(plantId);

	let data = null;
	parser.parseString(plantDeviceListData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'].service.devicelist;
		logger.debug(data);
	});

	return data;
}

/**
 * Function to retrieve the device parameters for a given deviceID and return the device parameters as a JSON object.
 * @date 01/11/2022 - 13:39:29
 *
 * @async
 * @param {string} plantId
 * @param {string} deviceId
 * @returns {Promise<any>}
 */
async function parseJSONPlantDeviceParameterData(plantId: string, deviceId: string): Promise<any> {
	const request = new PlantDeviceParametersRequest(
		'device',
		'GET',
		conn,
		token
	);
	const plantDeviceParameterData = await request.getPlantDeviceParametersData(plantId, deviceId);

	let data = null;
	parser.parseString(plantDeviceParameterData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'];
		logger.debug(data);
	});

	return data;
}

/**
 * Function to retrieve the last exact data from the Sunny Portal API.
 * @date 01/11/2022 - 13:41:35
 *
 * @async
 * @param {string} date
 * @returns {Promise<any>}
 */
async function parseJSONLastDataExactData(date: string): Promise<any> {
	const request = new DataRequest(
		'data',
		'GET',
		conn,
		token,
		plantoid,
	);
	const lastDataExactData = await request.getLastDataExactData(date);

	let data = null;
	parser.parseString(lastDataExactData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'];
		logger.debug(data);
	});

	return data;
}

/**
 * Function to retrieve all the generation data on a specific date from the Sunny Portal API.
 * @date 01/11/2022 - 13:42:37
 *
 * @async
 * @param {string} date
 * @param {string} interval
 * @returns {Promise<any>}
 */
async function parseJSONAllDataRequestData(date: string, interval: string): Promise<any> {
	const request = new DataRequest(
		'data',
		'GET',
		conn,
		token,
		plantoid
	);
	const allDataRequestData = await request.getAllDataRequestData(date, interval);

	let data = null;
	parser.parseString(allDataRequestData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'];
		logger.debug(data);
	});

	return data;
}

/**
 * Function to retrieve the day overview by day or quarter hour from the Sunny Portal API.
 * @date 01/11/2022 - 13:43:39
 *
 * @async
 * @param {string} date
 * @param {boolean} quarter
 * @param {boolean} include_all
 * @returns {Promise<any>}
 */
async function parseJSONDayOverviewRequestData(date: string, quarter: boolean, include_all: boolean): Promise<any> {
	const request = new DataRequest(
		'data',
		'GET',
		conn,
		token,
		plantoid
	);
	const allDataRequestData = await request.getDayOverviewRequestData(date, quarter, include_all);

	let data = null;
	parser.parseString(allDataRequestData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'];
		logger.debug(data);
	});

	return data;
}

/**
 * Function to retrieve the monthly overview from the Sunny Portal API.
 * @date 01/11/2022 - 16:25:05
 *
 * @async
 * @param {string} date
 * @returns {Promise<any>}
 */
async function parseJSONMonthOverviewRequestData(date: string): Promise<any> {
	const request = new DataRequest(
		'data',
		'GET',
		conn,
		token,
		plantoid
	);
	const allDataRequestData = await request.getMonthOverviewRequestData(date);

	let data = null;
	parser.parseString(allDataRequestData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'];
		logger.debug(data);
	});

	return data;
}

async function parseJSONYearlyOverviewRequestData(date: string): Promise<any> {
	const request = new DataRequest(
		'data',
		'GET',
		conn,
		token,
		plantoid
	);
	const allDataRequestData = await request.getYearOverviewRequestData(date);

	let data = null;
	parser.parseString(allDataRequestData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'];
		logger.debug(data);
	});

	return data;
}

async function parseJSONEnergyBalanceRequestData(date: string, period: string, interval: string, total?: boolean): Promise<any> {
	const request = new DataRequest(
		'data',
		'GET',
		conn,
		token,
		plantoid
	);
	const allDataRequestData = await request.getEnergeyBalanceRequestData(date, period, interval, total);

	let data = null;
	parser.parseString(allDataRequestData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'];
		logger.debug(data);
	});

	return data;
}

/*
 * Main program execution.
*/

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
	console.log('-------');
	console.log(`ENVIRONMENT: ${process.env.NODE_ENV}`);
	console.log('-------');
}

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

const token = await getToken(sunnyConfig.Login.email, sunnyConfig.Login.password);
const plantlist = await parseJSONPlantList();
const plantoid = plantlist.plantoid;
const plantData = await parseJSONPlantData(plantoid);
logger.info(plantData);

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
// console.dir(plantProfile);

const plantDeviceListData = await parseJSONPlantDeviceListData(plantoid);
// console.dir(plantDeviceListData);

const plantDeviceParameterData = await parseJSONPlantDeviceParameterData(plantoid, plantDeviceListData.device[0].$.oid);
// for (const key in plantDeviceParameterData.service.parameterlist.parameter) {
// 	console.dir(plantDeviceParameterData.service.parameterlist.parameter[key]);
// }

const lastDataExactData = await parseJSONLastDataExactData((new Date()).toISOString().slice(0, 10));
// for (const key in lastDataExactData.service.data.Energy) {
// 	console.dir(lastDataExactData.service.data.Energy[key]);
// }

const allDataRequestData = await parseJSONAllDataRequestData((new Date()).toISOString().slice(0, 10), 'month');
// for (const key in allDataRequestData.service.data.Energy.channel) {
// 	console.dir(allDataRequestData.service.data.Energy.channel[key].month);
// }

const dayOverviewRequestData = await parseJSONDayOverviewRequestData((new Date()).toISOString().slice(0, 10), true, true);
// console.dir(dayOverviewRequestData.service.data['overview-day-fifteen-total'].channel);
// for (const key in dayOverviewRequestData.service.data['overview-day-fifteen-total'].channel) {
// 	console.dir(dayOverviewRequestData.service.data['overview-day-fifteen-total'].channel[key].day.fiveteen);
// }

const today = new Date();
const datePreviousMonth = today.setDate(0);

const monthOverviewRequestData = await parseJSONMonthOverviewRequestData(getFirstDayOfTheMonth(new Date(datePreviousMonth)));
// console.dir(monthOverviewRequestData.service.data);
// for (const key in monthOverviewRequestData.service.data['overview-month-total'].channel) {
// 	console.dir(monthOverviewRequestData.service.data['overview-month-total'].channel[key].month.day);
// }

const yearlyOverviewRequestData = await parseJSONYearlyOverviewRequestData(getFirstDayOfTheMonth(new Date(datePreviousMonth)));
// console.dir(yearlyOverviewRequestData.service.data['overview-year-total'].channel);
// for (const key in yearlyOverviewRequestData.service.data['overview-year-total'].channel) {
// 	console.dir(yearlyOverviewRequestData.service.data['overview-year-total'].channel[key].year.month);
// }

const energyBalanceRequestData = await parseJSONEnergyBalanceRequestData("2022-10-01", "month", "day", false);
// console.dir(energyBalanceRequestData.service.data.energybalance.month);
// for (const key in energyBalanceRequestData.service.data.energybalance.month.day) {
// 	console.dir(energyBalanceRequestData.service.data.energybalance.month.day[key]);
// }

logout();
