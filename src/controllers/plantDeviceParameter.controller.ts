import { parser } from '../appConfig.js';
import { conn, token } from '../index.js';
import logger from '../logger/index.js';
import { PlantDeviceParametersRequest } from '../requests/BaseRequests.js';

/**
 * Function to retrieve the device parameters for a given deviceID and return the device parameters as a JSON object.
 * @date 01/11/2022 - 13:39:29
 *
 * @async
 * @param {string} plantId
 * @param {string} deviceId
 * @returns {Promise<any>}
 */
export async function parseJSONPlantDeviceParameterData(plantId: string, deviceId: string): Promise<any> {
	const request = new PlantDeviceParametersRequest(
		'device',
		'GET',
		conn,
		token
	);
	const plantDeviceParameterData = await request.getPlantDeviceParametersData(plantId, deviceId);

	let data = null;
	parser.parseString(plantDeviceParameterData, (_err: any, result: any) => {
		data = result['sma.sunnyportal.services'];
		logger.debug(data);
	});

	return data;
}
