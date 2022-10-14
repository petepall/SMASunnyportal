import pino, { Logger } from 'pino';
import { askForLoginData, checkIfFileExists, createFolder, readConfigFile, writeJsonFile } from './utils';

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