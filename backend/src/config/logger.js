const winston = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '..', '..', 'logs'); // Log directory relative to config/logger.js

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'verbose', // Set to verbose for more detailed logs in development
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: 'debug', // Log debug messages to console in development
    }),
  ],
  // Ensure log directory exists if using file transport in production
  ...(process.env.NODE_ENV === 'production' && {
    // File transport for production
    transports: [
      new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
      }),
      new winston.transports.File({
        filename: path.join(logDir, 'combined.log'),
        level: 'info',
      }),
    ],
  }),
});

module.exports = logger;
