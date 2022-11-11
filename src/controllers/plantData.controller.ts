import { parser } from '../appConfig.js';
import { conn, token } from '../index.js';
import {
	ICommunicationsProducts,
	IExpectedPlantProduction,
	IInverters,
	IModules,
	IPlantHeader,
	IPlantProfile
} from "../intefaces/IPlantProfileResponse";
import logger from '../logger/index.js';
import { PlantProfileRequest } from '../requests/BaseRequests.js';


/**
 * Function to retrieve the plant information based on the plantID and return the data as a JSON object.
 * @date 01/11/2022 - 13:38:50
 *
 * @async
 * @param {string} plantId
 * @returns {Promise<IPlantProfile>}
 */
export async function parseJSONPlantData(plantId: string): Promise<IPlantProfile> {
	const request = new PlantProfileRequest(
		'plant',
		'GET',
		conn,
		token
	);
	const plantData = await request.getPlantData(plantId);
	const data = await parser.parseStringPromise(plantData);
	logger.debug(data);


	// const plantProfile: IPlantProfile = {
	// 	plantHeader: {
	// 	},
	// 	expectedPlantProduction: {
	// 	},
	// 	modules: {
	// 	},
	// 	inverters: {
	// 	},
	// 	communicationProducts: {
	// 	},
	// };

	let header: IPlantHeader = {
		plantname: '',
		peakpower: 0,
		powerunit: '',
		location: '',
		startData: '',
		description: '',
		plantImage: '',
		plantImageHight: 0,
		plantImageWidth: 0,
	};

	const plantHeader = data['sma.sunnyportal.services'].service.plant;
	header = {
		plantname: plantHeader.name._,
		peakpower: parseInt(plantHeader['peak-power']._),
		powerunit: plantHeader['peak-power'].$.unit,
		location: plantHeader['city-country']._,
		startData: plantHeader['start-date']._,
		description: plantHeader.description._ === '&nbsp' ? plantHeader.description._ : '',
		plantImage: plantHeader['plant-image']._,
		plantImageHight: parseInt(plantHeader['plant-image'].$.height),
		plantImageWidth: parseInt(plantHeader['plant-image'].$.width),
	};

	let plantYield: IExpectedPlantProduction = {
		expectedYield: '',
		expectedYieldUnit: '',
		expectedCO2Reduction: '',
		expectedCO2ReductionUnit: '',
	};
	const expectedPlantProduction = data['sma.sunnyportal.services'].service.plant['production-data'].channel;
	plantYield = {
		expectedYield: expectedPlantProduction[0]._,
		expectedYieldUnit: expectedPlantProduction[0].$.unit,
		expectedCO2Reduction: expectedPlantProduction[1]._,
		expectedCO2ReductionUnit: expectedPlantProduction[1].$.unit,
	};

	const plantModules: IModules[] = [];
	const modules = data['sma.sunnyportal.services'].service.plant.modules;
	let counter = 0;
	for (const key in modules.module) {
		const details = [];
		if (modules.module.length === undefined) {
			if (key === '$') {
				for (const moduleKey in modules.module[key]) {
					details.push(modules.module[key][moduleKey]);
				}
				plantModules[counter] = {
					moduleName: modules.module._,
					numberOfModules: parseInt(details[0]),
					alignment: modules.alignment._,
					gradient: modules.gradient._,
				};
				counter++;
			}
		} else {
			for (const moduleKey in modules.module[key].$) {
				details.push(modules.module[key].$[moduleKey]);
			}
			plantModules[counter] = {
				moduleName: modules.module[key]._,
				numberOfModules: parseInt(details[0]),
				alignment: modules.alignment[key]._,
				gradient: modules.gradient[key]._,
			};
			counter++;
		}
	}

	const plantInverters: IInverters[] = [];
	const inverters = data['sma.sunnyportal.services'].service.plant.inverters;
	counter = 0;
	for (const key in inverters.inverter) {
		const details = [];
		if (inverters.inverter.length === undefined) {
			if (key === '$') {
				for (const inverterKey in inverters.inverter[key]) {
					details.push(inverters.inverter[key][inverterKey]);
				}
				plantInverters[counter] = {
					inverterName: inverters.inverter._,
					numberOfInverters: parseInt(details[0]),
					icon: details[1],
				};
				counter++;
			}
		} else {
			for (const inverterKey in inverters.inverter[key].$) {
				details.push(inverters.inverter[key].$[inverterKey]);
			}
			plantInverters[counter] = {
				inverterName: inverters.inverter[key]._,
				numberOfInverters: parseInt(details[0]),
				icon: details[1],
			};
			counter++;
		}
	}

	const plantCommunication: ICommunicationsProducts[] = [];
	const communicationProducts = data['sma.sunnyportal.services'].service.plant.communicationProducts;
	counter = 0;
	for (const key in communicationProducts.communicationProduct) {
		const details = [];
		if (communicationProducts.communicationProduct.length === undefined) {
			if (key === '$') {
				for (const communicationsKey in communicationProducts.communicationProduct[key]) {
					details.push(communicationProducts.communicationProduct[key][communicationsKey]);
				}
				plantCommunication[counter] = {
					communicationProductName: communicationProducts.communicationProduct._,
					numberOfCommunicationProducts: parseInt(details[0]),
					icon: details[1],
				};
				counter++;
			}
		} else {
			for (const communicationsKey in communicationProducts.communicationProduct[key].$) {
				details.push(communicationProducts.communicationProduct[key].$[communicationsKey]);
			}
			plantCommunication[counter] = {
				communicationProductName: communicationProducts.communicationProduct[key]._,
				numberOfCommunicationProducts: parseInt(details[0]),
				icon: details[1],
			};
			counter++;
		}
	}

	const plantProfile: IPlantProfile = {
		plantHeader: header,
		yield: plantYield,
		modules: plantModules,
		inverters: plantInverters,
		communicationsProducts: plantCommunication,
	};

	return plantProfile;
}
