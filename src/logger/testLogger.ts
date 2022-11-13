import { createLogger, format, Logger, transports } from 'winston';

function testLogger(): Logger {
	const logFormat = format.printf(({ level, message, timestamp, stack }) => {
		return `${timestamp} ${level}: ${message || stack}`;
	});

	return createLogger({
		level: 'info',
		format: format.combine(
			format.colorize(),
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.errors({ stack: true }),
			logFormat,
		),
		defaultMeta: { service: 'SMA_General' },
		transports: [
			//
			// - Write all logs with importance level of `error` or less to `error.log`
			// - Write all logs with importance level of `info` or less to `combined.log`
			//
			// new winston.transports.File({ filename: 'error.log', level: 'error' }),
			// new winston.transports.File({ filename: 'combined.log' }),
			new transports.Console(),
		],
	});
}

export default testLogger;
