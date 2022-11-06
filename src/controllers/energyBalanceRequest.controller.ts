import { parser } from '../appConfig.js';
import { conn, plantoid, token } from '../index.js';
import logger from '../logger/index.js';
import { DataRequest } from '../requests/DataRequest.js';

/**
 * function to retrieve the energy balance based on given period and interval from the sunny portal API.
 * Valid intervals for a given period:
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
 *
 * @date 04/11/2022 - 16:08:59
 *
 * @async
 * @param {string} date
 * @param {string} period
 * @param {string} interval
 * @param {?boolean} [total]
 * @returns {Promise<any>}
 */
export async function parseJSONEnergyBalanceRequestData(
	date: string,
	period: string,
	interval: string,
	total?: boolean,
	unit?: string
): Promise<any> {
	const request = new DataRequest(
		'data',
		'GET',
		conn,
		token,
		plantoid
	);
	const allDataRequestData = await request.getEnergeyBalanceRequestData(date, period, interval, total, unit);

	let data = null;
	parser.parseString(allDataRequestData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'];
		logger.debug(data);
	});

	return data;
}
