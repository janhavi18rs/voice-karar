import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle standard errors that are not instances of ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, err.errors || [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(env.env === 'development' && { stack: error.stack }),
  };

  // Log error stack locally
  logger.error(`${req.method} ${req.url} - Status ${error.statusCode}:`, error);

  res.status(error.statusCode).json(response);
};

export default errorHandler;
