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
