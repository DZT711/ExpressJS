// Shared error module — ONE import, ONE call handles everything.
//
//   const handleErrors = require('../middleware/errorHandler');
//
//   // ... your routes ...
//
//   handleErrors(router);                        // mounts /boom trigger + 404 + 500
//   handleErrors(router, { boomPath: false });   // production: 404 + 500 only, no /boom
//   handleErrors(router, {                      // custom messages:
///     notFoundMessage: 'Custom 404!',
//     errorMessage: 'Custom 500!',
//     boomMessage: 'Custom boom!',
//     boomPath: '/crash',     // trigger lives at /crash instead of /boom
//     logErrors: false,       // silence console.error
//   });
//
// What handleErrors(router) mounts, in order:
//   1. GET <boomPath> -> throws Error -> caught by Express
//   2. 404 catch-all (3 args)  -> "Are you stupid?404"
//   3. 500 handler   (4 args)  -> "Something broke!"
// All three live in this ONE function so every child API calls it the same way.

function createNotFoundHandler(message = 'Are you stupid?404') {
  return function notFoundHandler(req, res, next) {
    res.status(404).send(message);
  };
}

function createErrorHandler(options = {}) {
  const { message = 'Something broke! (500)', log = true } = options;
  return function errorHandler(err, req, res, next) {
    if (log) console.error(err.stack);
    res.status(err.status || 500).send(err.expose ? err.message : message);
  };
}

function createBoom(message = 'Boom! testing Something broke with error 500!') {
  return function boom500(req, res, next) {
    throw new Error(message);
  };
}

const notFoundHandler = createNotFoundHandler();
const errorHandler = createErrorHandler();
const boom500 = createBoom();

// THE one function you call — mounts trigger + 404 + 500 together.
function handleErrors(router, options = {}) {
  const {
    boomPath = '/boom',
    boomMessage,
    notFoundMessage,
    errorMessage,
    logErrors,
  } = options;

  if (boomPath) {
    router.get(boomPath, boomMessage !== undefined ? createBoom(boomMessage) : boom500);
  }
  router.use(
    notFoundMessage !== undefined ? createNotFoundHandler(notFoundMessage) : notFoundHandler
  );
  router.use(
    errorMessage !== undefined || logErrors !== undefined
      ? createErrorHandler({ message: errorMessage, log: logErrors })
      : errorHandler
  );
  return router;
}

module.exports = handleErrors;
module.exports.handleErrors = handleErrors;
module.exports.default = handleErrors;
// Low-level pieces still available if you ever need them:
module.exports.notFoundHandler = notFoundHandler;
module.exports.errorHandler = errorHandler;
module.exports.boom500 = boom500;
module.exports.createNotFoundHandler = createNotFoundHandler;
module.exports.createErrorHandler = createErrorHandler;
module.exports.createBoom = createBoom;



