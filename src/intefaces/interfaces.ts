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
export interface IInverters {
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
export interface ICommunicationsProducts {
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
export interface IModules {
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
export interface IExpectedPlantProduction {
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
export interface IPlantHeader {
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
	plantHeader: IPlantHeader;
	yield: IExpectedPlantProduction;
	modules: IModules[];
	inverters: IInverters[];
	communicationsProducts: ICommunicationsProducts[];
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

/**
 * Interface representing the devices used in a plant.
 * @date 06/11/2022 - 16:26:39
 *
 * @export
 * @interface IDeviceList
 * @typedef {IDeviceList}
 */
export interface IDeviceList {
	deviceID: string;
	deviceName: string;
	deviceClass: string;
	deviceSerial: string;
	deviceType: string;
	deviceStartDate: string;
}

/**
 * Interface representing the latest yield of a plant.
 * @date 06/11/2022 - 16:27:13
 *
 * @export
 * @interface ILastDataExact
 * @typedef {ILastDataExact}
 */
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

/**
 * Inteface representing the the data per month of a plant.
 * @date 06/11/2022 - 16:27:47
 *
 * @export
 * @interface IAllDataMonth
 * @typedef {IAllDataMonth}
 */
export interface IAllDataMonth {
	timestamp: string;
	Energy?: {
		absolute?: number;
		difference?: number;
	};
}

/**
 * Interface represeting the header data for the yield of a plant.
 * @date 06/11/2022 - 16:28:16
 *
 * @export
 * @interface IAllDataHeader
 * @typedef {IAllDataHeader}
 */
export interface IAllDataHeader {
	name: string;
	metaName: string;
	energyUnit: string;
}

/**
 * Interface representing the yearly yield of a plant.
 * @date 06/11/2022 - 16:28:54
 *
 * @export
 * @interface IAllDataYear
 * @typedef {IAllDataYear}
 */
export interface IAllDataYear {
	timestamp: string;
	absolute: number;
	difference: number;
}

/**
 * Interface Union representing the yield of a plant containing the monthly or yearly data
 * Monthly or yearly data is depending on how the interval parameter send to the server.
 * @date 06/11/2022 - 16:29:10
 *
 * @export
 * @interface IAllData
 * @typedef {IAllData}
 */
export interface IAllData {
	header: IAllDataHeader;
	month?: IAllDataMonth[];
	year?: IAllDataYear[];
}