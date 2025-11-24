const ApiError = require('../utils/ApiError');

const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || [],
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  return req.accepts('html')
    ? res.status(statusCode).render('pages/error', {
        layout: 'layouts/main',
        title: 'Error',
        error: response,
      })
    : res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};

