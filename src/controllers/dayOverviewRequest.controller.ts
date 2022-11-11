import { parser } from '../appConfig.js';
import { conn, plantoid, token } from '../index.js';
import logger from '../logger/index.js';
import { DataRequest } from '../requests/DataRequest.js';

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
export async function parseJSONDayOverviewRequestData(
	date: string,
	quarter: boolean,
	include_all: boolean
): Promise<any> {
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
