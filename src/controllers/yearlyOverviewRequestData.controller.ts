import { parser } from '../appConfig.js';
import { conn, plantoid, token } from '../index.js';
import { IYearlyOverview } from '../intefaces/IYearlyOverviewRessponse.js';
import logger from '../logger/index.js';
import { DataRequest } from '../requests/DataRequest.js';

/**
 * Function to retrieve the yearly yield data overview from the Sunny Portal API.
 * @date 04/11/2022 - 16:08:23
 *
 * @async
 * @param {string} date
 * @returns {Promise<IYearlyOverview>}
 */
export async function parseJSONYearlyOverviewRequestData(
	date: string,
): Promise<IYearlyOverview> {
	const request = new DataRequest('data', 'GET', conn, token, plantoid);
	const allDataRequestData = await request.getYearOverviewRequestData(date);

	const data = parser.parseStringPromise(allDataRequestData);
	logger.debug(data);

	return data as Promise<IYearlyOverview>;
}
