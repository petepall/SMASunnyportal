import { parser } from '../appConfig.js';
import { conn, plantoid, token } from '../index.js';
import { IMonthOverview } from '../intefaces/IMonthOverviewResponse.js';
import logger from '../logger/index.js';
import { DataRequest } from '../requests/DataRequest.js';

/**
 * Function to retrieve the monthly overview from the Sunny Portal API.
 * @date 01/11/2022 - 16:25:05
 *
 * @async
 * @param {string} date
 * @returns {Promise<any>}
 */
export async function parseJSONMonthOverviewRequestData(
	date: string,
): Promise<IMonthOverview> {
	const request = new DataRequest('data', 'GET', conn, token, plantoid);
	const allDataRequestData = await request.getMonthOverviewRequestData(date);

	const data = parser.parseStringPromise(allDataRequestData);
	logger.debug(data);

	return data as Promise<IMonthOverview>;
}
