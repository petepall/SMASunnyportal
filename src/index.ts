import pino, { Logger } from 'pino';
import { Parser } from 'xml2js';
import { RequestBase } from './requests.js';
import {
	askForLoginData,
	checkIfFileOrPathExists,
	createFolder,
	readConfigFile,
	writeJsonFile
} from './utils.js';

// Setup
const parser = new Parser({
	explicitArray: false,
});

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
if (checkIfFileOrPathExists('./config/config.json')) {
	sunnyConfig = readConfigFile('./config/config.json');
	logger.info("config file successfully read");
} else {
	const info = askForLoginData();
	sunnyConfig.Login.email = info.email;
	sunnyConfig.Login.password = info.password;
	sunnyConfig.General.baseUrl = info.baseUrl;

	if (!checkIfFileOrPathExists('./config')) {
		createFolder('./config');
	}
	writeJsonFile('./config/config.json', sunnyConfig);
}

const request = new RequestBase(
	sunnyConfig.General.baseUrl,
	'authentication',
	undefined,
	'GET',
	100,
	'services',
);

const url = request.prepareUrl([sunnyConfig.Login.email], { 'password': sunnyConfig.Login.password });
const data = await request.executeRequest(url, 'GET');
parser.parseString(data, (err: any, result: any) => {
	logger.info(result);
});
