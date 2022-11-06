
import { appConnection, getConfig } from './appConfig.js';
import { parseJSONAllDataRequestData } from './controllers/allDataRequest.controller.js';
import { parseJSONDayOverviewRequestData } from './controllers/dayOverviewRequest.controller.js';
import { parseJSONEnergyBalanceRequestData } from './controllers/energyBalanceRequest.controller.js';
import { parseJSONLastDataExactData } from './controllers/lastDataExact.controller.js';
import { logout } from './controllers/logout.controller.js';
import { parseJSONPlantData } from './controllers/plantData.controller.js';
import { parseJSONPlantDeviceListData } from './controllers/plantDeviceList.controller.js';
import { parseJSONPlantDeviceParameterData } from './controllers/plantDeviceParameter.controller.js';
import { parseJSONPlantList } from './controllers/plantList.controller.js';
import { IToken } from './intefaces/interfaces.js';
import logger from './logger/index.js';
import {
	AuthenticationRequest
} from './requests/BaseRequests.js';

/**
 * function to get the login token
 * @date 04/11/2022 - 16:12:06
 *
 * @async
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

/*
 * Main program execution.
*/

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
	console.log('-------');
	console.log(`ENVIRONMENT: ${process.env.NODE_ENV}`);
	console.log('-------');
}

const sunnyConfig = getConfig();
export const conn = appConnection(sunnyConfig);

export const token = await getToken(sunnyConfig.Login.email, sunnyConfig.Login.password);
const plantlist = await parseJSONPlantList();
export const plantoid = plantlist.plantoid;
const plantProfile = await parseJSONPlantData(plantoid);
logger.debug(plantProfile);

const plantDeviceListData = await parseJSONPlantDeviceListData(plantoid);
logger.debug(plantDeviceListData);

for (const device of plantDeviceListData) {
	const plantDeviceParameterData = await parseJSONPlantDeviceParameterData(
		plantoid,
		device.deviceID // provide the deviceID of the device you want to get the parameters for
	);
	for (const key in plantDeviceParameterData.service.parameterlist.parameter) {
		logger.debug(plantDeviceParameterData.service.parameterlist.parameter[key]);
	}
}

const lastDataExactData = await parseJSONLastDataExactData((new Date()).toISOString().slice(0, 10));
logger.debug(lastDataExactData);

const allDataRequestData = await parseJSONAllDataRequestData(
	(new Date()).toISOString().slice(0, 10),
	'year'
);
logger.debug(allDataRequestData);

const dayOverviewRequestData = await parseJSONDayOverviewRequestData(
	(new Date()).toISOString().slice(0, 10),
	false,
	true
);
logger.debug(dayOverviewRequestData.service.data);
// for (const key in dayOverviewRequestData.service.data['overview-day-fifteen-total'].channel) {
// 	logger.info(dayOverviewRequestData.service.data['overview-day-fifteen-total'].channel[key].day.fiveteen);
// }

// const today = new Date();
// const datePreviousMonth = today.setDate(0);

// const monthOverviewRequestData = await parseJSONMonthOverviewRequestData(
// 	getFirstDayOfTheMonth(
// 		new Date(datePreviousMonth))
// );
// // console.dir(monthOverviewRequestData.service.data);
// // for (const key in monthOverviewRequestData.service.data['overview-month-total'].channel) {
// // 	console.dir(monthOverviewRequestData.service.data['overview-month-total'].channel[key].month.day);
// // }

// const yearlyOverviewRequestData = await parseJSONYearlyOverviewRequestData(
// 	getFirstDayOfTheMonth(
// 		new Date(datePreviousMonth))
// );
// // console.dir(yearlyOverviewRequestData.service.data['overview-year-total'].channel);
// // for (const key in yearlyOverviewRequestData.service.data['overview-year-total'].channel) {
// // 	console.dir(yearlyOverviewRequestData.service.data['overview-year-total'].channel[key].year.month);
// // }

const energyBalanceRequestData = await parseJSONEnergyBalanceRequestData(
	"2022-11-05",
	"month",
	"hour",
	false,
	'W'
);
logger.info(energyBalanceRequestData.service);
// for (const key in energyBalanceRequestData.service.data.energybalance.month.day) {
// 	console.dir(energyBalanceRequestData.service.data.energybalance.month.day[key]);
// }

logout();
