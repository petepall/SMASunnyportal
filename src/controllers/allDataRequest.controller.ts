import { parser } from '../appConfig.js';
import { conn, plantoid, token } from '../index.js';
import { IAllData, IAllDataHeader, IAllDataMonth, IAllDataYear } from "../intefaces/IAllDataResponse";
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
export async function parseJSONAllDataRequestData(date: string, interval: string): Promise<IAllData> {
	const request = new DataRequest(
		'data',
		'GET',
		conn,
		token,
		plantoid
	);
	const allDataRequestData = await request.getAllDataRequestData(date, interval);

	const data = await parser.parseStringPromise(allDataRequestData);
	logger.debug(data);

	const allDataHeader: IAllDataHeader = {
		name: data['sma.sunnyportal.services'].service.data.Energy.channel.$.name,
		metaName: data['sma.sunnyportal.services'].service.data.Energy.channel.$['meta-name'],
		energyUnit: data['sma.sunnyportal.services'].service.data.Energy.channel.$.unit,
	};
	logger.debug(allDataHeader);

	const allDataMonth: IAllDataMonth[] = [];

	if (interval === 'month') {
		for (const key of data['sma.sunnyportal.services'].service.data.Energy.channel.infinite.month) {
			allDataMonth.push({
				timestamp: key.$.timestamp,
				Energy: {
					absolute: parseFloat(key.$.absolute),
					difference: parseFloat(key.$.difference),
				}
			});
		}
	}
	logger.debug(allDataMonth);

	const allDataYear: IAllDataYear[] = [];
	if (interval === 'year') {
		const key = data['sma.sunnyportal.services'].service.data.Energy.channel.infinite.year;
		allDataYear.push({
			timestamp: key.$.timestamp,
			absolute: parseFloat(key.$.absolute),
			difference: parseFloat(key.$.difference),
		});
	}
	logger.debug(allDataYear);

	const allData: IAllData = {
		header: allDataHeader,
		month: allDataMonth,
		year: allDataYear,
	};

	logger.debug(allData);

	return allData;
}
