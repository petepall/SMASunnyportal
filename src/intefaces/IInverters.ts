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
