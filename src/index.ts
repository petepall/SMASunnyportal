import fs from 'fs';
import pino, { Logger } from 'pino';
import promptSync from 'prompt-sync';


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
function readConfigFile (configFile: string): any {
	const config = JSON.parse(fs.readFileSync(configFile).toString());
	return config;
}

function checkIfFileExists (path: string): boolean {
	return fs.existsSync(path);
}

function createFolder (path: string): void {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
}

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

function askForLoginData (): any {
	console.log("The configuration file is missing. let's set it up \n");

	const prompt = promptSync();
	const email = prompt('Please enter your email: ');
	const password = prompt('Please enter your password: ');
	return { email, password };
}

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