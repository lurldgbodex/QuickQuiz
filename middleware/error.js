// Import dependencies
const createError = require('http-errors');

// Define error middleware function
function errorHandler(err, req, res, next) {
  // Set status code
  res.status(err.status || 500);

  // Send error message
  res.json({
    error: {
      status: err.status || 500,
      message: err.message || 'Internal Server Error'
    }
  });
}

// Define custom error handling middleware function
function notFoundHandler(req, res, next) {
  next(createError(404, 'Not Found'));
}

// Export middleware functions
module.exports = { errorHandler, notFoundHandler };
