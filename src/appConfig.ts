import axios, { AxiosInstance } from 'axios';
import fs from 'fs';
import { Parser } from 'xml2js';
import { ISunnyConfig } from "./intefaces/ISunnyConfig";
import { askForLoginData, checkIfFileOrPathExists, createFolder, readConfigFile, writeJsonFile } from './lib/utils.js';
import logger from './logger/index.js';


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


export function appConnection(sunnyConfig: ISunnyConfig): AxiosInstance {
	// Setup connection to Sunny Portal
	const conn = axios.create({
		baseURL: sunnyConfig.General.baseUrl,
		timeout: 8000,
		headers: { 'Content-Type': 'application/xlm' }
	});

	return conn;
}

// Setup the parser for turning XML into JSON.
export const parser = new Parser({
	explicitArray: false,
});
