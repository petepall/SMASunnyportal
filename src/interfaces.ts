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
 * Interface representing the inverters used in a plant.
 * @date 23/10/2022 - 16:56:22
 *
 * @interface IInverters
 * @typedef {IInverters}
 */
interface IInverters {
	inverterName: string;
	numberOfInverters: number;
	icon: string;
}

/**
 * Inteface representing the communication products used in a plant.
 * @date 23/10/2022 - 16:56:41
 *
 * @interface ICommunicationsProducts
 * @typedef {ICommunicationsProducts}
 */
interface ICommunicationsProducts {
	communicationProductName: string;
	numberOfCommunicationProducts: number;
	icon: string;
}

/**
 * Interface representing the solar panels, alignment and orientation used in a plant.
 * @date 23/10/2022 - 16:56:59
 *
 * @interface IModules
 * @typedef {IModules}
 */
interface IModules {
	moduleName: string;
	numerOfModules: number;
	alignment: number;
	gradient: number;
}

/**
 * Interface representing the expectied yearly production of a plant.
 * @date 23/10/2022 - 16:57:53
 *
 * @interface IExpectedPlantProduction
 * @typedef {IExpectedPlantProduction}
 */
interface IExpectedPlantProduction {
	expectedYield: string;
	expectedYieldUnit: string;
	expectedCO2Reduction: string;
	expectedCO2ReductionUnit: string;
}

/**
 * Interface represeing the plant header information.
 * @date 23/10/2022 - 16:58:35
 *
 * @interface IPlantHeader
 * @typedef {IPlantHeader}
 */
interface IPlantHeader {
	plantname: string;
	peakpower: number;
	powerunit: string;
	location: string;
	startData: string;
	description: string;
	plantImage: string;
	plantImageHight: number;
	plantImageWidth: number;
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
		[key: string]: IPlantHeader;
	};
	expectedPlantProduction: {
		[key: string]: IExpectedPlantProduction;
	};
	modules: {
		[key: string]: IModules;
	};
	inverters: {
		[key: string]: IInverters;
	};
	communicationProducts: {
		[key: string]: ICommunicationsProducts;
	};
}

export interface ISunnyConfig {
	Login: {
		email: string;
		password: string;
	},
	General: {
		baseUrl: string;
	},
}