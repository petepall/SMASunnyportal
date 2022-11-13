import { appConnection, getConfig } from './appConfig.js';
import { logout } from './controllers/logout.controller.js';
import { parseJSONPlantData } from './controllers/plantData.controller.js';
import { parseJSONPlantList } from './controllers/plantList.controller.js';
import { parseJSONYearlyOverviewRequestData } from './controllers/yearlyOverviewRequestData.controller.js';
import { IToken } from './intefaces/IToken';
import { IYearlyOverview } from './intefaces/IYearlyOverviewRessponse.js';
import { getFirstDayOfTheMonth } from './lib/utils.js';
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
	const request = new AuthenticationRequest('Authentication', 'GET', conn);
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

export const token = await getToken(
	sunnyConfig.Login.email,
	sunnyConfig.Login.password,
);
const plantlist = await parseJSONPlantList();
export const plantoid = plantlist.plantoid;
const plantProfile = await parseJSONPlantData(plantoid);
logger.debug(plantProfile);

// const plantDeviceListData = await parseJSONPlantDeviceListData(plantoid);
// logger.debug(plantDeviceListData);

// for (const device of plantDeviceListData) {
// 	const plantDeviceParameterData = await parseJSONPlantDeviceParameterData(
// 		plantoid,
// 		device.deviceID // provide the deviceID of the device you want to get the parameters for
// 	);
// 	for (const key in plantDeviceParameterData.service.parameterlist.parameter) {
// 		logger.debug(plantDeviceParameterData.service.parameterlist.parameter[key]);
// 	}
// }

// const lastDataExactData = await parseJSONLastDataExactData((new Date()).toISOString().slice(0, 10));
// logger.debug(lastDataExactData);

// const allDataRequestData = await parseJSONAllDataRequestData(
// 	(new Date()).toISOString().slice(0, 10),
// 	'year'
// );
// logger.debug(allDataRequestData);

// const dayOverviewRequestData = await parseJSONDayOverviewRequestData(
// 	(new Date()).toISOString().slice(0, 10),
// 	false,
// 	true
// );
// logger.debug(dayOverviewRequestData.service.data);

const today = new Date();
const datePreviousMonth = today.setDate(0);

// const monthOverviewRequestData: IMonthOverview =
// 	await parseJSONMonthOverviewRequestData(
// 		getFirstDayOfTheMonth(new Date(datePreviousMonth)),
// 	);
// logger.debug(monthOverviewRequestData['sma.sunnyportal.services'].service);
// for (const _ in monthOverviewRequestData['sma.sunnyportal.services'].service
// 	.data['overview-month-total']) {
// 	logger.info(
// 		monthOverviewRequestData['sma.sunnyportal.services'].service.data[
// 			'overview-month-total'
// 		],
// 	);
// }

const yearlyOverviewRequestData: IYearlyOverview =
	await parseJSONYearlyOverviewRequestData(
		getFirstDayOfTheMonth(new Date(datePreviousMonth)),
	);
logger.debug(yearlyOverviewRequestData['sma.sunnyportal.services'].service);

let counter = 0;
for (const _ in yearlyOverviewRequestData['sma.sunnyportal.services'].service
	.data['overview-year-total'].channel[0].year.month) {
	logger.debug(
		yearlyOverviewRequestData['sma.sunnyportal.services'].service.data[
			'overview-year-total'
		].channel[0].year.month[counter].$,
	);
	counter++;
}

// const EnergyBalanceInfiniteYear: IEnergyBalanceInfiniteYear = await parseJSONEnergyBalanceInfiniteYear(
// 	"2022-11-05",
// 	false
// );
// logger.debug(EnergyBalanceInfiniteYear['sma.sunnyportal.services'].service);

// const EnergyBalanceInfiniteYearTotal: IEnergyBalanceInfiniteYearTotal = await parseJSONEnergyBalanceInfiniteYear(
// 	"2022-11-05",
// 	true
// );
// logger.debug(EnergyBalanceInfiniteYearTotal['sma.sunnyportal.services'].service);

// const EnergyBalanceInfiniteMonth: IEnergyBalanceInfiniteMonth = await parseJSONEnergyBalanceInfiniteMonth(
// 	"2022-11-05",
// 	false
// );
// logger.debug(EnergyBalanceInfiniteMonth['sma.sunnyportal.services'].service);

// const EnergyBalanceInfiniteMonthTotal: IEnergyBalanceInfiniteMonthTotal = await parseJSONEnergyBalanceInfiniteMonth(
// 	"2022-11-05",
// 	true
// );
// logger.debug(EnergyBalanceInfiniteMonthTotal['sma.sunnyportal.services'].service);

// const EnergyBalanceYearYear: IEnergyBalanceYearYear | IEnergyBalanceYearYearTotal = await parseJSONEnergyBalanceYearYear(
// 	"2022-11-05",
// 	false
// );
// logger.debug(EnergyBalanceYearYear['sma.sunnyportal.services'].service);

// const EnergyBalanceYearYearTotal: IEnergyBalanceYearYear | IEnergyBalanceYearYearTotal = await parseJSONEnergyBalanceYearYear(
// 	"2022-11-05",
// 	true
// );
// logger.debug(EnergyBalanceYearYearTotal['sma.sunnyportal.services'].service);

// const EnergyBalanceYearMonth: IEnergyBalanceYearMonth | IEnergyBalanceYearMonthTotal = await parseJSONEnergyBalanceYearMonth(
// 	"2022-11-05",
// 	false
// );
// logger.debug(EnergyBalanceYearMonth['sma.sunnyportal.services'].service);

// const EnergyBalanceYearMonthTotal: IEnergyBalanceYearMonth | IEnergyBalanceYearMonthTotal = await parseJSONEnergyBalanceYearMonth(
// 	"2022-11-05",
// 	true
// );
// logger.debug(EnergyBalanceYearMonthTotal['sma.sunnyportal.services'].service);

// const EnergyBalanceYearDay: IEnergyBalanceYearDay | IEnergyBalanceYearDayTotal = await parseJSONEnergyBalanceYearDay(
// 	"2022-11-05",
// 	false
// );
// logger.debug(EnergyBalanceYearDay['sma.sunnyportal.services'].service);

// const EnergyBalanceYearDayTotal: IEnergyBalanceYearDay | IEnergyBalanceYearDayTotal = await parseJSONEnergyBalanceYearDay(
// 	"2022-11-05",
// 	true
// );
// logger.debug(EnergyBalanceYearDayTotal['sma.sunnyportal.services'].service);

// const EnergyBalanceMonthMonth: IEnergyBalanceMonthMonth | IEnergyBalanceMonthMonthTotal = await parseJSONEnergyBalanceMonthMonth(
// 	"2022-11-05",
// 	false
// );
// logger.info(EnergyBalanceMonthMonth['sma.sunnyportal.services'].service);

// const EnergyBalanceMonthMonthTotal: IEnergyBalanceMonthMonth | IEnergyBalanceMonthMonthTotal = await parseJSONEnergyBalanceMonthMonth(
// 	"2022-11-05",
// 	true
// );
// logger.info(EnergyBalanceMonthMonthTotal['sma.sunnyportal.services'].service);

// const EnergyBalanceMonthDay:
// 	| IEnergyBalanceMonthDay
// 	| IEnergyBalanceMonthDayTotal = await parseJSONEnergyBalanceMonthDay(
// 	'2022-11-05',
// 	false,
// );
// logger.info(EnergyBalanceMonthDay['sma.sunnyportal.services'].service);

// const EnergyBalanceMonthDayTotal:
// 	| IEnergyBalanceMonthDay
// 	| IEnergyBalanceMonthDayTotal = await parseJSONEnergyBalanceMonthDay(
// 	'2022-11-05',
// 	true,
// );
// logger.info(EnergyBalanceMonthDayTotal['sma.sunnyportal.services'].service);

// const EnergyBalanceMonthHour: IEnergyBalanceMonthHour =
// 	await parseJSONEnergyBalanceMonthHour('2022-11-05', false);
// logger.debug(EnergyBalanceMonthHour['sma.sunnyportal.services'].service);

// const EnergyBalanceMonthQuarter: IEnergyBalanceMonthQuarter =
// 	await parseJSONEnergyBalanceMonthHour('2022-11-05', false);
// logger.debug(EnergyBalanceMonthQuarter['sma.sunnyportal.services'].service);

// const EnergyBalanceDayDay: IEnergyBalanceDayDay =
// 	await parseJSONEnergyBalanceDayDay('2022-11-05', false);
// logger.info(EnergyBalanceDayDay['sma.sunnyportal.services'].service);

// const EnergyBalanceDayDayTotal: IEnergyBalanceDayDay =
// 	await parseJSONEnergyBalanceDayDay('2022-11-05', false);
// logger.info(EnergyBalanceDayDayTotal['sma.sunnyportal.services'].service);

// const EnergyBalanceDayhour: IEnergyBalanceDayHour =
// 	await parseJSONEnergyBalanceDayHour('2022-11-05', false);
// logger.debug(EnergyBalanceDayhour['sma.sunnyportal.services'].service);

// const EnergyBalanceDayQuarter: IEnergyBalanceDayQuarter =
// 	await parseJSONEnergyBalanceDayQuarter('2022-11-05', false);
// logger.debug(EnergyBalanceDayQuarter['sma.sunnyportal.services'].service);

logout();
