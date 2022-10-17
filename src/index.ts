import pino, { Logger } from 'pino';
import {
	askForLoginData,
	checkIfFileOrPathExists,
	createFolder,
	readConfigFile,
	writeJsonFile
} from './utils.js';

// Setup

const logger: Logger = pino({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
	level: 'info',
});

let sunnyConfig = {
	Login: {
		email: '',
		password: '',
	},
	General: {
		baseUrl: '',
	},
};

// Main logic
if (checkIfFileOrPathExists('./dist/config/config.json')) {
	sunnyConfig = readConfigFile('./dist/config/config.json');
	logger.info(sunnyConfig);
} else {
	const info = askForLoginData();
	sunnyConfig.Login.email = info.email;
	sunnyConfig.Login.password = info.password;
	sunnyConfig.General.baseUrl = info.baseUrl;

	if (!checkIfFileOrPathExists('./dist/config')) {
		createFolder('./dist/config');
	}
	writeJsonFile('./dist/config/config.json', sunnyConfig);
}
// logger.info(
// 	new RequestBase(
// 		'authorization',
// 		{ 'secret_key': '12345', 'identifier': '3456' },
// 		'GET',
// 		100
// 	).prepareUrl(["authentication"]));