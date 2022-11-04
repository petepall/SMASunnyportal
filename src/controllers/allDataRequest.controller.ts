import { parser } from '../appConfig.js';
import { conn, plantoid, token } from '../index.js';
import logger from '../logger/index.js';
import { DataRequest } from '../requests/DataRequest.js';

/**
 * Function to retrieve all the generation data on a specific date from the Sunny Portal API.
 * @date 01/11/2022 - 13:42:37
 *
 * @async
 * @param {string} date
 * @param {string} interval
 * @returns {Promise<any>}
 */
export async function parseJSONAllDataRequestData(date: string, interval: string): Promise<any> {
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
