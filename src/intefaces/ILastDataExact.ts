/**
 * Interface representing the latest yield of a plant.
 * @date 06/11/2022 - 16:27:13
 *
 * @export
 * @interface ILastDataExact
 * @typedef {ILastDataExact}
 */
export interface ILastDataExact {
	name: string;
	metaName: string;
	energyUnit: string;
	day: {
		timestamp: string;
		absolute: number;
		difference: number;
	};
	hour: {
		timestamp: string;
		absolute: number;
		difference: number;
	};
}
