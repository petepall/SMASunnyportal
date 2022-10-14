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

let sunnyConfig = {
	Login: {
		email: '',
		password: ''
	},
	General: {
		baseUrl: '',
	}
};

// Check if the config file exists and read the data, if not existing, create it.
if (fs.existsSync('./dist/config/config.json')) {
	sunnyConfig = JSON.parse(fs.readFileSync('./dist/config/config.json').toString())
	console.log(sunnyConfig);
} else {
	const prompt = promptSync();
	console.log("The configuration file is missing. let's set it up \n");
	sunnyConfig.Login.email = prompt('Please enter your email: ');
	sunnyConfig.Login.password = prompt('Please enter your password: ');
	const data = JSON.stringify(sunnyConfig, null, "\t");

	if (!fs.existsSync('./dist/config')) {
		fs.mkdirSync('./dist/config');
	};
	fs.writeFile('./dist/config/config.json', data, 'utf8', err => {
		if (err) {
			logger.error(`The following error ocurred\n ${err}`);
		} else {
			logger.info('The config file is created');
		}
	})
};
