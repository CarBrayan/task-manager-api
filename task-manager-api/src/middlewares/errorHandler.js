const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(err.stack || err.message);
  const status = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  res.status(status).json({ message });
}

module.exports = errorHandler;