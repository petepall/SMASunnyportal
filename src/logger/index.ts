import { Logger } from 'winston';
import devLogger from './devLogger.js';
import prodLogger from './prodLogger.js';
import testLogger from './testLogger.js';

let logger: Logger;

if (process.env.NODE_ENV === 'development') {
	logger = devLogger();
} else if (process.env.NODE_ENV === 'test') {
	logger = testLogger();
} else {
	logger = prodLogger();
}

export default logger;
