import axios from 'axios';
import fs from 'fs';
import { ISunnyConfig } from './interfaces.js';
import logger from './logger/index.js';
import { askForLoginData, checkIfFileOrPathExists, createFolder, readConfigFile, writeJsonFile } from './utils.js';


export function getConfig(): ISunnyConfig {
	const configFile = './config/config.json';
	let sunnyConfig: ISunnyConfig = {
		Login: {
			email: '',
			password: '',
		},
		General: {
			baseUrl: '',
		},
	};

	if (checkIfFileOrPathExists(configFile) && fs.statSync(configFile).size > 0) {
		sunnyConfig = readConfigFile(configFile);
		logger.info("config file successfully read");
	} else {
		const info = askForLoginData();
		sunnyConfig.Login.email = info.email;
		sunnyConfig.Login.password = info.password;
		sunnyConfig.General.baseUrl = info.baseUrl;
		if (!checkIfFileOrPathExists('./config')) {
			createFolder('./config');
		}
		writeJsonFile(configFile, sunnyConfig);
	}

	return sunnyConfig;
}


export function appConnection(sunnyConfig: ISunnyConfig) {
	// Setup connection to Sunny Portal
	const conn = axios.create({
		baseURL: sunnyConfig.General.baseUrl,
		timeout: 8000,
		headers: { 'Content-Type': 'application/xlm' }
	});

	return conn;
}
