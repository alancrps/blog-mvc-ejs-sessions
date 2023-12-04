import { createLogger, format, transports } from 'winston';
import dotenv from 'dotenv';
dotenv.config();

const logFormat = format.combine(
	format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), //formato de tiempo
	format.printf(({ timestamp, level, message }) => {
		return `${timestamp} [${level}]: ${message}`;
	}) //configuracion del formato del blog
);
const logFormatConsole = format.combine(
	format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
	format.colorize(),
	format.printf(({ timestamp, level, message }) => {
		return `[${timestamp}][${level}]: ${message}`;
	})
);
//instancia de winston
const logger = createLogger({
	level: process.env.BLOG_LOG_LEVEL, // nivel del registro ('debug' (registra todo!),'info', 'warning', 'error',) ocupan espacio
	format: logFormat,
	transports: [
		new transports.Console(),
		new transports.File({
			format: logFormat,
			filename: 'app.log',
			maxFiles: 2,
			maxsize: 1024,
		}),
	], // el transports es donde quiero que lo registre
});

export default logger;
