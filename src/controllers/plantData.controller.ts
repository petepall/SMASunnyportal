import { parser } from '../appConfig.js';
import { conn, token } from '../index.js';
import { IPlantProfile } from '../intefaces/interfaces.js';
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


	const plantProfile: IPlantProfile = {
		plantHeader: {
		},
		expectedPlantProduction: {
		},
		modules: {
		},
		inverters: {
		},
		communicationProducts: {
		},
	};

	const plantHeader = data['sma.sunnyportal.services'].service.plant;
	plantProfile.plantHeader = {
		plantname: plantHeader.name._,
		peakpower: plantHeader['peak-power']._,
		powerunit: plantHeader['peak-power'].$.unit,
		location: plantHeader['city-country']._,
		startData: plantHeader['start-date']._,
		description: plantHeader.description._,
		plantImage: plantHeader['plant-image']._,
		plantImageHight: plantHeader['plant-image'].$.height,
		plantImageWidth: plantHeader['plant-image'].$.width,
	};

	const expectedPlantProduction = data['sma.sunnyportal.services'].service.plant['production-data'].channel;
	plantProfile.expectedPlantProduction = {
		expectedYield: expectedPlantProduction[0]._,
		expectedYieldUnit: expectedPlantProduction[0].$.unit,
		expectedCO2Reduction: expectedPlantProduction[1]._,
		expectedCO2ReductionUnit: expectedPlantProduction[1].$.unit,
	};

	const modules = data['sma.sunnyportal.services'].service.plant.modules;
	for (const key in modules.module) {
		const details = [];
		if (modules.module.length === undefined) {
			if (key === '$') {
				for (const moduleKey in modules.module[key]) {
					details.push(modules.module[key][moduleKey]);
				}
				plantProfile.modules[key] = {
					moduleName: modules.module._,
					numberOfModules: parseInt(details[0]),
					alignment: modules.alignment._,
					gradient: modules.gradient._,
				};
			}
		} else {
			for (const moduleKey in modules.module[key].$) {
				details.push(modules.module[key].$[moduleKey]);
			}
			plantProfile.modules[key] = {
				moduleName: modules.module[key]._,
				numberOfModules: parseInt(details[0]),
				alignment: modules.alignment[key]._,
				gradient: modules.gradient[key]._,
			};
		}
	}

	const inverters = data['sma.sunnyportal.services'].service.plant.inverters;
	for (const key in inverters.inverter) {
		const details = [];
		if (inverters.inverter.length === undefined) {
			if (key === '$') {
				for (const inverterKey in inverters.inverter[key]) {
					details.push(inverters.inverter[key][inverterKey]);
				}
				plantProfile.inverters[key] = {
					inverterName: inverters.inverter._,
					numberOfInverters: parseInt(details[0]),
					icon: details[1],
				};
			}
		} else {
			for (const inverterKey in inverters.inverter[key].$) {
				details.push(inverters.inverter[key].$[inverterKey]);
			}
			plantProfile.inverters[key] = {
				inverterName: inverters.inverter[key]._,
				numberOfInverters: parseInt(details[0]),
				icon: details[1],
			};
		}
	}

	const communicationProducts = data['sma.sunnyportal.services'].service.plant.communicationProducts;
	for (const key in communicationProducts.communicationProduct) {
		const details = [];
		if (communicationProducts.communicationProduct.length === undefined) {
			if (key === '$') {
				for (const communicationsKey in communicationProducts.communicationProduct[key]) {
					details.push(communicationProducts.communicationProduct[key][communicationsKey]);
				}
				plantProfile.communicationProducts[key] = {
					communicationProductName: communicationProducts.communicationProduct._,
					numberOfCommunicationProducts: parseInt(details[0]),
					icon: details[1],
				};
			}
		} else {
			for (const communicationsKey in communicationProducts.communicationProduct[key].$) {
				details.push(communicationProducts.communicationProduct[key].$[communicationsKey]);
			}
			plantProfile.communicationProducts[key] = {
				communicationProductName: communicationProducts.communicationProduct[key]._,
				numberOfCommunicationProducts: parseInt(details[0]),
				icon: details[1],
			};
		}
	}

	return plantProfile;
}
