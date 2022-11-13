/**
 * functions to retrieve the energy balance based on given period and interval
 * from the sunny portal API.
 * functions based on perdiod and interval:
 *   Period     | Interval     | Unit
 *   =====================================
 *  infinite   | year         | kWh 👍
 *  infinite   | month        | kWh 👍
 *  Year       | year         | kWh 👍
 *  Year       | month        | kWh 👍
 *  Year       | day          | kWh 👍
 *  Month      | month        | kWh 👍
 *  Month      | day          | kWh ❌
 *  Month      | hour         | W   ❌
 *  Month      | fifteen      | W   ❌
 *  Day        | day          | kWh ❌
 *  Day        | hour         | W   ❌
 *  Day        | fifteen      | W   ❌
 */
import { parser } from '../appConfig.js';
import { conn, plantoid, token } from '../index.js';
import {
	IEnergyBalanceInfiniteMonth,
	IEnergyBalanceInfiniteMonthTotal
} from '../intefaces/IEnergyBalanceInfiniteMonthResponse.js';
import {
	IEnergyBalanceInfiniteYear,
	IEnergyBalanceInfiniteYearTotal
} from '../intefaces/IEnergyBalanceInfiniteYearResponse.js';
import { IEnergyBalanceMonthDay, IEnergyBalanceMonthDayTotal } from '../intefaces/IEnergyBalanceMonthDayResponse.js';
import { IEnergyBalanceMonthMonth, IEnergyBalanceMonthMonthTotal } from '../intefaces/IEnergyBalanceMonthMonthResponse.js';
import { IEnergyBalanceYearDay, IEnergyBalanceYearDayTotal } from '../intefaces/IEnergyBalanceYearDayResponse.js';
import { IEnergyBalanceYearYear, IEnergyBalanceYearYearTotal } from '../intefaces/IEnergyBalanceYearYearResponse.js';
import { IEnergyBalanceYearMonth, IEnergyBalanceYearMonthTotal } from '../intefaces/IEnergyBalkanceYearMonthResponse.js';
import logger from '../logger/index.js';
import { DataRequest } from '../requests/DataRequest.js';

function requestSetup() {
	return new DataRequest(
		'data',
		'GET',
		conn,
		token,
		plantoid
	);
}

/**
 * function to retrieve the energy balance based on infinite and year.
 * @date 04/11/2022 - 16:08:59
 *
 * @async
 * @param {string} date
 * @param {string} period
 * @param {string} interval
 * @param {?boolean} [total]
 * @returns {Promise<any>}
 */
export async function parseJSONEnergyBalanceInfiniteYear(
	date: string,
	total = false
): Promise<IEnergyBalanceInfiniteYear | IEnergyBalanceInfiniteYearTotal> {
	const request = requestSetup();
	const params = {
		period: 'infinite',
		interval: 'year',
		unit: 'kWh',
	};

	const requestData = await request.getEnergeyBalanceRequestData(
		date,
		params.period,
		params.interval,
		total,
		params.unit
	);

	const data: Promise<
		IEnergyBalanceInfiniteYear |
		IEnergyBalanceInfiniteYearTotal
	> = parser.parseStringPromise(requestData);
	logger.debug(data);

	return data as Promise<
		IEnergyBalanceInfiniteYear |
		IEnergyBalanceInfiniteYearTotal
	>;
}

export async function parseJSONEnergyBalanceInfiniteMonth(
	date: string,
	total = false
): Promise<IEnergyBalanceInfiniteMonth | IEnergyBalanceInfiniteMonthTotal> {
	const request = requestSetup();
	const params = {
		period: 'infinite',
		interval: 'month',
		unit: 'kWh',
	};

	const requestData = await request.getEnergeyBalanceRequestData(
		date,
		params.period,
		params.interval,
		total,
		params.unit
	);

	const data: Promise<
		IEnergyBalanceInfiniteMonth |
		IEnergyBalanceInfiniteMonthTotal
	> = parser.parseStringPromise(requestData);
	logger.debug(data);

	return data as Promise<
		IEnergyBalanceInfiniteMonth |
		IEnergyBalanceInfiniteMonthTotal
	>;
}

export async function parseJSONEnergyBalanceYearYear(
	date: string,
	total = false
): Promise<IEnergyBalanceYearYear | IEnergyBalanceYearYearTotal> {
	const request = requestSetup();
	const params = {
		period: 'year',
		interval: 'year',
		unit: 'kWh',
	};

	const requestData = await request.getEnergeyBalanceRequestData(
		date,
		params.period,
		params.interval,
		total,
		params.unit
	);

	const data: Promise<
		IEnergyBalanceYearYear | IEnergyBalanceYearYearTotal
	> = parser.parseStringPromise(requestData);
	logger.debug(data);

	return data as Promise<
		IEnergyBalanceYearYear | IEnergyBalanceYearYearTotal
	>;
}

export async function parseJSONEnergyBalanceYearMonth(
	date: string,
	total = false
): Promise<IEnergyBalanceYearMonth | IEnergyBalanceYearMonthTotal> {
	const request = requestSetup();
	const params = {
		period: 'year',
		interval: 'month',
		unit: 'kWh',
	};

	const requestData = await request.getEnergeyBalanceRequestData(
		date,
		params.period,
		params.interval,
		total,
		params.unit
	);

	const data: Promise<
		IEnergyBalanceYearMonth | IEnergyBalanceYearMonthTotal
	> = parser.parseStringPromise(requestData);
	logger.debug(data);

	return data as Promise<
		IEnergyBalanceYearMonth | IEnergyBalanceYearMonthTotal
	>;
}

export async function parseJSONEnergyBalanceYearDay(
	date: string,
	total = false
): Promise<IEnergyBalanceYearDay | IEnergyBalanceYearDayTotal> {
	const request = requestSetup();
	const params = {
		period: 'year',
		interval: 'day',
		unit: 'kWh',
	};

	const requestData = await request.getEnergeyBalanceRequestData(
		date,
		params.period,
		params.interval,
		total,
		params.unit
	);

	const data: Promise<
		IEnergyBalanceYearDay | IEnergyBalanceYearDayTotal
	> = parser.parseStringPromise(requestData);
	logger.debug(data);

	return data as Promise<
		IEnergyBalanceYearDay | IEnergyBalanceYearDayTotal
	>;
}

export async function parseJSONEnergyBalanceMonthMonth(
	date: string,
	total = false
): Promise<IEnergyBalanceMonthMonth | IEnergyBalanceMonthMonthTotal> {
	const request = requestSetup();
	const params = {
		period: 'month',
		interval: 'month',
		unit: 'kWh',
	};

	const requestData = await request.getEnergeyBalanceRequestData(
		date,
		params.period,
		params.interval,
		total,
		params.unit
	);

	const data: Promise<
		IEnergyBalanceMonthMonth | IEnergyBalanceMonthMonthTotal
	> = parser.parseStringPromise(requestData);
	logger.debug(data);

	return data as Promise<
		IEnergyBalanceMonthMonth | IEnergyBalanceMonthMonthTotal
	>;
}

export async function parseJSONEnergyBalanceMonthDay(
	date: string,
	total = false
): Promise<IEnergyBalanceMonthDay | IEnergyBalanceMonthDayTotal> {
	const request = requestSetup();
	const params = {
		period: 'month',
		interval: 'day',
		unit: 'kWh',
	};

	const requestData = await request.getEnergeyBalanceRequestData(
		date,
		params.period,
		params.interval,
		total,
		params.unit
	);

	const data: Promise<
		IEnergyBalanceMonthDay | IEnergyBalanceMonthDayTotal
	> = parser.parseStringPromise(requestData);
	logger.debug(data);

	return data as Promise<
		IEnergyBalanceMonthDay | IEnergyBalanceMonthDayTotal
	>;
}