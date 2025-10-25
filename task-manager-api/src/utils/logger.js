const winston = require('winston');
const dotenv = require('dotenv');

dotenv.config();

const logLevel = process.env.LOG_LEVEL || 'info';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()]
});

// Atajos para niveles personalizados
logger.http = (msg) => logger.log('http', msg);

module.exports = logger;