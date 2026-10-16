// Shared error-handling middleware — require from any router or app.js.
// Usage:
//   const { notFoundHandler, errorHandler } = require('../middleware/errorHandler');
//   router.use(notFoundHandler);
//   router.use(errorHandler);
// Or with custom messages:
//   const { createNotFoundHandler, createErrorHandler } = require('../middleware/errorHandler');
//   router.use(createNotFoundHandler('Custom 404!'));
//   router.use(createErrorHandler({ message: 'Custom 500!' }));

function createNotFoundHandler(message = 'Are you stupid?') {
  return function notFoundHandler(req, res, next) {
    res.status(404).send(message);
  };
}

function createErrorHandler(options = {}) {
  const { message = 'Something broke!', log = true } = options;
  return function errorHandler(err, req, res, next) {
    if (log) console.error(err.stack);
    res.status(err.status || 500).send(err.expose ? err.message : message);
  };
}

// Default instances — backwards compatible with your current text
const notFoundHandler = createNotFoundHandler();
const errorHandler = createErrorHandler();

module.exports = {
  notFoundHandler,
  errorHandler,
  createNotFoundHandler,
  createErrorHandler,
};
