
import { appConnection, getConfig } from './appConfig.js';
import { parseJSONAllDataRequestData } from './controllers/allDataRequest.controller.js';
import { parseJSONDayOverviewRequestData } from './controllers/dayOverviewRequest.controller.js';
import {
	parseJSONEnergyBalanceInfiniteMonth,
	parseJSONEnergyBalanceInfiniteYear
} from './controllers/energyBalanceRequest.controller.js';
import { parseJSONLastDataExactData } from './controllers/lastDataExact.controller.js';
import { logout } from './controllers/logout.controller.js';
import { parseJSONPlantData } from './controllers/plantData.controller.js';
import { parseJSONPlantDeviceListData } from './controllers/plantDeviceList.controller.js';
import { parseJSONPlantDeviceParameterData } from './controllers/plantDeviceParameter.controller.js';
import { parseJSONPlantList } from './controllers/plantList.controller.js';
import {
	IEnergyBalanceInfiniteMonth,
	IEnergyBalanceInfiniteMonthTotal
} from './intefaces/IEnergyBalanceInfiniteMonthResponse.js';
import {
	IEnergyBalanceInfiniteYear,
	IEnergyBalanceInfiniteYearTotal
} from './intefaces/IEnergyBalanceInfiniteYearResponse.js';
import { IToken } from "./intefaces/IToken";
import logger from './logger/index.js';
import { AuthenticationRequest } from './requests/BaseRequests.js';

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

const EnergyBalanceInfiniteYear: IEnergyBalanceInfiniteYear = await parseJSONEnergyBalanceInfiniteYear(
	"2022-11-05",
	false
);
logger.debug(EnergyBalanceInfiniteYear['sma.sunnyportal.services'].service);

const EnergyBalanceInfiniteYearTotal: IEnergyBalanceInfiniteYearTotal = await parseJSONEnergyBalanceInfiniteYear(
	"2022-11-05",
	true
);
logger.debug(EnergyBalanceInfiniteYearTotal['sma.sunnyportal.services'].service);

const EnergyBalanceInfiniteMonth: IEnergyBalanceInfiniteMonth = await parseJSONEnergyBalanceInfiniteMonth(
	"2022-11-05",
	false
);
logger.info(EnergyBalanceInfiniteMonth['sma.sunnyportal.services'].service);

const EnergyBalanceInfiniteMonthTotal: IEnergyBalanceInfiniteMonthTotal = await parseJSONEnergyBalanceInfiniteMonth(
	"2022-11-05",
	true
);
logger.info(EnergyBalanceInfiniteMonthTotal['sma.sunnyportal.services'].service);

logout();
