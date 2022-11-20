import fs from 'fs';
import promptSync from 'prompt-sync';
import { ISunnyConfig } from '../intefaces/ISunnyConfig.js';
import logger from '../logger/index.js';
import { LoginData } from '../types/LoginData';

/**
 * Create a logger instance
 * @date 14/10/2022 - 18:42:49
 *
 * @type {Logger}
 */

// Functions
/**
 * Read a JSON file and return the content
 * @date 14/10/2022 - 18:42:49
 *
 * @param {string} configFile
 * @returns {*}
 */
export function readConfigFile(configFile: string): ISunnyConfig {
	const config = JSON.parse(fs.readFileSync(configFile).toString());
	return config as ISunnyConfig;
}

/**
 * check if a file or path exists on the filesystem
 * @date 14/10/2022 - 18:42:49
 *
 * @param {string} path
 * @returns {boolean}
 */
export function checkIfFileOrPathExists(path: string): boolean {
	return fs.existsSync(path);
}

/**
 * Check if a folder exists, if not create it
 * @date 14/10/2022 - 18:42:49
 *
 * @param {string} path
 */
export function createFolder(path: string): void {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
}

/**
 * Ask user login data
 * @date 14/10/2022 - 18:42:49
 *
 * @returns {*}
 */
export function askForLoginData(): LoginData {
	console.log("The configuration file is missing. let's set it up \n");

	const prompt = promptSync();
	const baseUrl = prompt(
		'Press enter to set default baseUrl (https://com.sunny-portal.de) Or enter your base url: ',
		{ value: 'https://com.sunny-portal.de' },
	);
	const email = prompt('Please enter your email: ');
	const password = prompt('Please enter your password: ', { echo: '*' });

	return { email, password, baseUrl };
}

/**
 * Create a JSON file given the path and the data
 * @date 14/10/2022 - 18:42:49
 *
 * @param {string} path
 * @param {*} data
 */
export function writeJsonFile(path: string, data: ISunnyConfig): void {
	const jsonData = JSON.stringify(data, null, '\t');
	fs.writeFile(path, jsonData, 'utf8', (err) => {
		if (err) {
			logger.error(`The following error ocurred\n ${err}`);
		} else {
			logger.info('**************************');
			logger.info('The config file is created');
			logger.info('**************************');
		}
	});
}

/**
 * Function to determine the first day of the month based on a given date
 * @date 01/11/2022 - 14:03:33
 *
 * @export
 * @param {Date} date
 * @returns {string} - date in the format YYYY-MM-DD
 */
export function getFirstDayOfTheMonth(date: Date): string {
	date.setDate(1);

	return date.toISOString().slice(0, 10);
}

/**
 * Function to check if a key exists in an object
 * @date 03/11/2022 - 16:51:00
 *
 * @param {*} obj
 * @param {string} key
 * @returns {*}
 */
export const keyExists = (obj: any, key: string): boolean => {
	if (!obj || (typeof obj !== 'object' && !Array.isArray(obj))) {
		return false;
	}

	// eslint-disable-next-line no-prototype-builtins
	else if (obj.hasOwnProperty(key)) {
		return true;
	} else if (Array.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			const result1 = keyExists(obj[i], key);
			if (result1) {
				return result1;
			}
		}
	} else {
		for (const k in obj) {
			const result1 = keyExists(obj[k], key);
			if (result1) {
				return result1;
			}
		}
	}

	return false;
};

/**
 * Function to convert kilowattpiek to wattpiek
 * @date 03/11/2022 - 16:51:19
 *
 * @param {number} kwp
 * @returns {number}
 */
export const kwpTOwp = (kwp: number): number => {
	return kwp * 1000;
};
