import { AxiosInstance } from 'axios';
import { IToken } from '../intefaces/interfaces.js';
import { RequestBase } from './BaseRequests.js';

/**
 * Class to handle the retrieval of the last yield data from the sunny portal API.
 * @date 30/10/2022 - 16:48:49
 *
 * @export
 * @class LastDataExactRequest
 * @typedef {DataRequest}
 * @extends {RequestBase}
 */

export class DataRequest extends RequestBase {
	token: IToken;
	plantID: string;

	/**
	 * Creates an instance of DataRequest.
	 * @date 01/11/2022 - 13:29:16
	 *
	 * @constructor
	 * @param {string} service
	 * @param {string} method
	 * @param {AxiosInstance} conn
	 * @param {IToken} token
	 * @param {string} plantID
	 */
	constructor(
		service: string,
		method: string,
		conn: AxiosInstance,
		token: IToken,
		plantID: string
	) {
		super(service, method, conn, token);
		{
			this.token = token;
			this.plantID = plantID;
		}
	}

	/**
	 * Method to retrieve the last yield data from the sunny portal API.
	 * @date 30/10/2022 - 16:49:52
	 *
	 * @async
	 * @param {string} date
	 * @returns {Promise<any>}
	 */
	async getLastDataExactData(date: string): Promise<any> {
		const url = this.prepareUrl(
			[this.plantID, "Energy", date],
			{
				"culture": "en-gb",
				"identifier": this.token.identifier,
				"unit": "kWh",
				"view": "Lastdataexact"
			}
		);
		const lastDataExactData = await this.executeRequest(url);

		return lastDataExactData;
	}

	/**
	 * Method to get all the solar generation data for a given date from the sunny portal API.
	 * @date 01/11/2022 - 13:49:28
	 *
	 * @async
	 * @param {string} date
	 * @param {string} interval
	 * @returns {Promise<any>}
	 */
	async getAllDataRequestData(date: string, interval: string): Promise<any> {
		const url = this.prepareUrl(
			[this.plantID, "Energy", date],
			{
				"culture": "en-gb",
				"identifier": this.token.identifier,
				"period": "infinite",
				"interval": interval,
				"unit": "kWh",
			}
		);
		const allDataRequestData = await this.executeRequest(url);

		return allDataRequestData;
	}

	/**
	 * Method to retrieve the solar generation data for a given date per day or quarter hour from the sunny portal API.
	 * @date 01/11/2022 - 13:50:05
	 *
	 * @async
	 * @param {string} date
	 * @param {boolean} [quarter=true]
	 * @param {boolean} [include_all=false]
	 * @returns {Promise<any>}
	 */
	async getDayOverviewRequestData(date: string, quarter = true, include_all = false): Promise<any> {
		const datatype = quarter ? "day-fifteen" : "day";
		const url = this.prepareUrl(
			[this.plantID, `overview-${datatype}-total`, date],
			{
				"culture": "en-gb",
				"identifier": this.token.identifier,
			}
		);
		const dayOverviewRequestData = await this.executeRequest(url);

		return dayOverviewRequestData;

	}

	/**
	 * Method to retrieve the solar generation data for a given month per day from the sunny portal API.
	 * @date 01/11/2022 - 16:40:40
	 *
	 * @async
	 * @param {string} date
	 * @returns {Promise<any>}
	 */
	async getMonthOverviewRequestData(date: string): Promise<any> {
		const url = this.prepareUrl(
			[this.plantID, `overview-month-total`, date],
			{
				"culture": "en-gb",
				"identifier": this.token.identifier,
			}
		);
		const monthOverviewRequestData = await this.executeRequest(url);

		return monthOverviewRequestData;
	}

	/**
	 * Method to retrieve the solar generation data for a given year per month from the sunny portal API.
	 * @date 01/11/2022 - 16:41:19
	 *
	 * @async
	 * @param {string} date
	 * @returns {Promise<any>}
	 */
	async getYearOverviewRequestData(date: string): Promise<any> {
		const url = this.prepareUrl(
			[this.plantID, `overview-year-total`, date],
			{
				"culture": "en-gb",
				"identifier": this.token.identifier,
			}
		);
		const yearOverviewRequestData = await this.executeRequest(url);

		return yearOverviewRequestData;
	}

	async getEnergeyBalanceRequestData(date: string, period: string, interval: string, total = false, unit = 'kWh'): Promise<any> {
		/**
		* Valid intervals for a given period:
		*		- infinite: year, month
		*		- year: year, month, day
		*		- month: month, day, hour, fifteen
		*		- day: day, hour, fifteen
		*/
		const datatype = total ? "energybalancetotal" : "energybalance";

		const url = this.prepareUrl(
			[this.plantID, "sets", datatype, date],
			{
				"culture": "en-gb",
				"identifier": this.token.identifier,
				"period": period,
				"interval": interval,
				"unit": unit,
			}
		);
		const energyBalanceRequestData = await this.executeRequest(url);

		return energyBalanceRequestData;
	}
}
