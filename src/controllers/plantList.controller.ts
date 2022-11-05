import { parser } from '../appConfig.js';
import { conn, token } from '../index.js';
import { IPlantList } from '../intefaces/interfaces';
import logger from '../logger/index.js';
import { PlantListRequest } from '../requests/BaseRequests.js';

/**
 * Function to retrieve the list of plants and return the plant id and name as object.
 * @date 01/11/2022 - 13:38:26
 *
 * @async
 * @returns {Promise<IPlantList>}
 */
export async function parseJSONPlantList(): Promise<IPlantList> {
	const request = new PlantListRequest(
		'plantlist',
		'GET',
		conn,
		token
	);
	const plantList: IPlantList = {
		plantname: '',
		plantoid: '',
	};
	const parsePlantListData = await request.getPlantListData();
	parser.parseString(parsePlantListData, (err: Error | null, result: any) => {
		plantList.plantname = result['sma.sunnyportal.services'].service.plantlist.plant.$.name;
		plantList.plantoid = result['sma.sunnyportal.services'].service.plantlist.plant.$.oid;
		logger.debug(plantList);
	});
	return plantList;
}
