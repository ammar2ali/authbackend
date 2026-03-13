const ApiError = require('../utils/ApiError');

/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
    errors = err.keyValue;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid Token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token Expired';
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: errors
  });
};

module.exports = errorHandler;
