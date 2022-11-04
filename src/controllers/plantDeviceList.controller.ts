import { parser } from '../appConfig.js';
import { conn, token } from '../index.js';
import { IDeviceList } from '../intefaces/interfaces.js';
import logger from '../logger/index.js';
import { PlantDeviceListRequest } from '../requests/BaseRequests.js';

/**
 * Function to retrieve the list of devices for a plant and return the device list as a JSON object.
 * @date 01/11/2022 - 13:39:08
 *
 * @async
 * @param {string} plantId
 * @returns {Promise<any>}
 */
export async function parseJSONPlantDeviceListData(plantId: string): Promise<IDeviceList[]> {
	const request = new PlantDeviceListRequest(
		'device',
		'GET',
		conn,
		token
	);
	const plantDeviceListData = await request.getPlantDeviceListData(plantId);

	const data = await parser.parseStringPromise(plantDeviceListData);
	logger.debug(data);

	const devicelist: IDeviceList[] = [];

	const devices = data['sma.sunnyportal.services'].service.devicelist.device;
	logger.debug(devices);

	for (const key in devices) {
		const details = [];
		if (devices.length === undefined) {
			if (key === '$') {
				for (const deviceKey in devices[key]) {
					details.push(devices[key][deviceKey]);
				}
				devicelist[0] = {
					deviceID: details[0],
					deviceName: details[2],
					deviceClass: details[3],
					deviceSerial: details[1],
					deviceType: details[4],
					deviceStartDate: details[5],
				};
			}
		} else {
			for (const deviceKey in devices[key].$) {
				details.push(devices[key].$[deviceKey]);
			}
			devicelist[parseInt(key)] = {
				deviceID: details[0],
				deviceName: details[2],
				deviceClass: details[3],
				deviceSerial: details[1],
				deviceType: details[4],
				deviceStartDate: details[5],
			};
		}
	}

	return devicelist;
}
