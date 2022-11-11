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
