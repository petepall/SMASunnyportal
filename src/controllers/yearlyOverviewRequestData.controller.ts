import { parser } from '../appConfig.js';
import { conn, plantoid, token } from '../index.js';
import logger from '../logger/index.js';
import { DataRequest } from '../requests/DataRequest.js';

/**
 * Function to retrieve the yearly yield data overview from the Sunny Portal API.
 * @date 04/11/2022 - 16:08:23
 *
 * @async
 * @param {string} date
 * @returns {Promise<any>}
 */
export async function parseJSONYearlyOverviewRequestData(date: string): Promise<any> {
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
