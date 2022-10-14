import fs from 'fs';
import pino, { Logger } from 'pino';
import promptSync from 'prompt-sync';

/**
 * Create a logger instance
 * @date 14/10/2022 - 18:42:49
 *
 * @type {Logger}
 */
const logger: Logger = pino({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
	level: 'info'
});

// Functions
/**
 * Read a JSON file and return the content
 * @date 14/10/2022 - 18:42:49
 *
 * @param {string} configFile
 * @returns {*}
 */
export function readConfigFile (configFile: string): any {
	const config = JSON.parse(fs.readFileSync(configFile).toString());
	return config;
}

/**
 * check if a file or path exists on the filesystem
 * @date 14/10/2022 - 18:42:49
 *
 * @param {string} path
 * @returns {boolean}
 */
export function checkIfFileOrPathExists (path: string): boolean {
	return fs.existsSync(path);
}

/**
 * Check if a folder exists, if not create it
 * @date 14/10/2022 - 18:42:49
 *
 * @param {string} path
 */
export function createFolder (path: string): void {
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
export function askForLoginData (): any {
	console.log("The configuration file is missing. let's set it up \n");

	const prompt = promptSync();
	const email = prompt('Please enter your email: ');
	const password = prompt('Please enter your password: ');
	return { email, password };
}

/**
 * Create a JSON file given the path and the data
 * @date 14/10/2022 - 18:42:49
 *
 * @param {string} path
 * @param {*} data
 */
export function writeJsonFile (path: string, data: any): void {
	const jsonData = JSON.stringify(data, null, "\t");
	fs.writeFile(path, jsonData, 'utf8', err => {
		if (err) {
			logger.error(`The following error ocurred\n ${err}`);
		} else {
			logger.info('**************************');
			logger.info('The config file is created');
			logger.info('**************************');
		}
	});
}