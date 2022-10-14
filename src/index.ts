import fs from 'fs';
import pino, { Logger } from 'pino';
import promptSync from 'prompt-sync';

// Setup
/**
 * Description placeholder
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
 * Description placeholder
 * @date 14/10/2022 - 18:42:49
 *
 * @param {string} configFile
 * @returns {*}
 */
function readConfigFile (configFile: string): any {
	const config = JSON.parse(fs.readFileSync(configFile).toString());
	return config;
}

/**
 * Description placeholder
 * @date 14/10/2022 - 18:42:49
 *
 * @param {string} path
 * @returns {boolean}
 */
function checkIfFileExists (path: string): boolean {
	return fs.existsSync(path);
}

/**
 * Description placeholder
 * @date 14/10/2022 - 18:42:49
 *
 * @param {string} path
 */
function createFolder (path: string): void {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
}

/**
 * Description placeholder
 * @date 14/10/2022 - 18:42:49
 *
 * @param {string} path
 * @param {*} data
 */
function writeJsonFile (path: string, data: any): void {
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

/**
 * Description placeholder
 * @date 14/10/2022 - 18:42:49
 *
 * @returns {*}
 */
function askForLoginData (): any {
	console.log("The configuration file is missing. let's set it up \n");

	const prompt = promptSync();
	const email = prompt('Please enter your email: ');
	const password = prompt('Please enter your password: ');
	return { email, password };
}

/**
 * Description placeholder
 * @date 14/10/2022 - 18:42:49
 *
 * @type {{ Login: { email: string; password: string; }; General: { baseUrl: string; }; }}
 */
let sunnyConfig = {
	Login: {
		email: '',
		password: ''
	},
	General: {
		baseUrl: '',
	}
};

// Main logic
if (checkIfFileExists('./dist/config/config.json')) {
	sunnyConfig = readConfigFile('./dist/config/config.json');
	console.log(sunnyConfig);
} else {
	const info = askForLoginData();
	sunnyConfig.Login.email = info.email;
	sunnyConfig.Login.password = info.password;

	if (!checkIfFileExists('./dist/config')) {
		createFolder('./dist/config');
	}
	writeJsonFile('./dist/config/config.json', sunnyConfig);
}