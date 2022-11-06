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
	numberOfModules: number;
	alignment: string;
	gradient: string;
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
	peakpower: string;
	powerunit: string;
	location: string;
	startData: string;
	description: string;
	plantImage: string;
	plantImageHight: string;
	plantImageWidth: string;
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

/**
 * Interface representing the configuration object for the sunny portal API.
 * @date 24/10/2022 - 13:19:38
 *
 * @export
 * @interface ISunnyConfig
 * @typedef {ISunnyConfig}
 */
export interface ISunnyConfig {
	Login: {
		email: string;
		password: string;
	},
	General: {
		baseUrl: string;
	},
}

export interface IDeviceList {
	deviceID: string;
	deviceName: string;
	deviceClass: string;
	deviceSerial: string;
	deviceType: string;
	deviceStartDate: string;
}

export interface ILastDataExact {
	name: string,
	metaName: string,
	energyUnit: string,
	day: {
		timestamp: string,
		absolute: number,
		difference: number,
	},
	hour: {
		timestamp: string,
		absolute: number,
		difference: number,
	};
}

export interface IAllDataMonth {
	timestamp: string;
	Energy?: {
		absolute?: number;
		difference?: number;
	};
}

export interface IAllDataHeader {
	name: string;
	metaName: string;
	energyUnit: string;
}

export interface IAllDataYear {
	timestamp: string;
	absolute: number;
	difference: number;
}

export interface IAllData {
	header: IAllDataHeader;
	month?: IAllDataMonth[];
	year?: IAllDataYear[];
}