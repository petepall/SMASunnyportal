import { parser } from '../appConfig.js';
import { conn, plantoid, token } from '../index.js';
import logger from '../logger/index.js';
import { DataRequest } from '../requests/DataRequest.js';

/**
 * Function to retrieve the last exact data from the Sunny Portal API.
 * @date 01/11/2022 - 13:41:35
 *
 * @async
 * @param {string} date
 * @returns {Promise<any>}
 */
export async function parseJSONLastDataExactData(date: string): Promise<any> {
	const request = new DataRequest(
		'data',
		'GET',
		conn,
		token,
		plantoid
	);
	const lastDataExactData = await request.getLastDataExactData(date);

	let data = null;
	parser.parseString(lastDataExactData, (err: any, result: any) => {
		data = result['sma.sunnyportal.services'];
		logger.debug(data);
	});

	return data;
}
