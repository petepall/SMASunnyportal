/**
 * functions to retrieve the energy balance based on given period and interval from the sunny portal API.
 * functions based on perdiod and interval:
 *   Period     | Interval     | Unit
 *   =====================================
 *  infinite   | year         | kWh
 *  infinite   | month        | kWh
 *  infinite   | day          | kWh
 *  Year       | year         | kWh
 *  Year       | month        | kWh
 *  Year       | day          | kWh
 *  Month      | month        | kWh
 *  Month      | day          | kWh
 *  Month      | hour         | W
 *  Month      | fifteen      | W
 *  Day        | day          | kWh
 *  Day        | hour         | W
 *  Day        | fifteen      | W
 */

import { parser } from '../appConfig.js';
import { conn, plantoid, token } from '../index.js';
import logger from '../logger/index.js';
import { DataRequest } from '../requests/DataRequest.js';

function requestSetup() {
	return new DataRequest(
		'data',
		'GET',
		conn,
		token,
		plantoid
	);
}

/**
 * function to retrieve the energy balance based on infinite and year.
 * @date 04/11/2022 - 16:08:59
 *
 * @async
 * @param {string} date
 * @param {string} period
 * @param {string} interval
 * @param {?boolean} [total]
 * @returns {Promise<any>}
 */
export async function parseJSONEnergyBalanceInfiniteYear(date: string, total = false): Promise<any> {
	const request = requestSetup();
	const params = {
		period: 'infinite',
		interval: 'year',
		unit: 'kWh',
	};

	const requestData = await request.getEnergeyBalanceRequestData(
		date,
		params.period,
		params.interval,
		total,
		params.unit
	);

	const data = parser.parseStringPromise(requestData);
	logger.debug(data);

	//TODO: parse the data to the IEnergyBalanceInfiniteYear interface


	//TODO: parse the data to the IEnergyBalanceInfiniteYearTotal interface

	return data;
}
