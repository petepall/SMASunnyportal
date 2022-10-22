/**
 * Interface representing the token object from the sunny portal API.
 * @date 22/10/2022 - 23:31:23
 *
 * @export
 * @interface IToken
 * @typedef {IToken}
 */
export interface IToken {
	secret_key: string;
	identifier: string;
}

/**
 * Inerface representing the plant list object from the sunny portal API.
 * @date 22/10/2022 - 23:31:56
 *
 * @export
 * @interface IPlantList
 * @typedef {IPlantList}
 */
export interface IPlantList {
	plantname: string;
	plantoid: string;
}

/**
 * Interface representing the plant information object from the sunny portal API.
 * @date 22/10/2022 - 23:32:58
 *
 * @export
 * @interface IPlantProfile
 * @typedef {IPlantProfile}
 */
export interface IPlantProfile {
	plantHeader: {
		plantname: string;
		peakpower: number;
		powerunit: string;
		location: string;
		startData: string;
		description: string;
		plantImage: string;
		plantImageHight: number;
		plantImageWidth: number;
	};
	expectedPlantProduction: {
		expectedYield: string;
		expectedYieldUnit: string;
		expectedCO2Reduction: string;
		expectedCO2ReductionUnit: string;
	};
	modules: {
		moduleName: string;
		numerOfModules: number;
		alignment: number;
		gradient: number;
	};
	inverters: {
		inverterName: string;
		numberOfInverters: number;
		icon: string;
	};
	communicationProducts: {
		communicationProductName: string;
		numberOfCommunicationProducts: number;
		icon: string;
	};
}
