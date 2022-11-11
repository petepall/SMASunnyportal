import { parser } from '../appConfig.js';
import { conn, plantoid, token } from '../index.js';
import { ILastDataExact } from "../intefaces/ILastDataExact";
import logger from '../logger/index.js';
import { DataRequest } from '../requests/DataRequest.js';

/**
 * Function to retrieve the last exact data from the Sunny Portal API.
 * @date 05/11/2022 - 13:36:50
 *
 * @export
 * @async
 * @param {string} date
 * @returns {Promise<ILastDataExact>}
 */
export async function parseJSONLastDataExactData(date: string): Promise<ILastDataExact> {
	const request = new DataRequest(
		'data',
		'GET',
		conn,
		token,
		plantoid
	);
	const lastDataExactData = await request.getLastDataExactData(date);

	const data = await parser.parseStringPromise(lastDataExactData);
	logger.debug(data);

	const lastDataExact: ILastDataExact = {
		name: '',
		metaName: '',
		energyUnit: '',
		day: {
			timestamp: '',
			absolute: 0,
			difference: 0,
		},
		hour: {
			timestamp: '',
			absolute: 0,
			difference: 0,
		}
	};

	const lastData = data['sma.sunnyportal.services'].service.data.Energy.channel;
	lastDataExact.name = lastData.$.name;
	lastDataExact.metaName = lastData.$['meta-name'];
	lastDataExact.energyUnit = lastData.$.unit;
	lastDataExact.day.timestamp = lastData.day.$.timestamp;
	lastDataExact.day.absolute = parseInt(lastData.day.$.absolute);
	lastDataExact.day.difference = parseInt(lastData.day.$.difference);
	lastDataExact.hour.timestamp = lastData.hour.$.timestamp;
	lastDataExact.hour.absolute = parseInt(lastData.hour.$.absolute);
	lastDataExact.hour.difference = parseInt(lastData.hour.$.difference);

	logger.debug(lastDataExact);

	return lastDataExact;
}
