var express = require('express');
var router = express.Router();
var { notFoundHandler, errorHandler } = require('../middleware/errorHandler');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/', function(req, res, next) {
  res.send('POST');
});
router.put('/', function(req, res, next) {
  res.send('PUT');
});
router.delete('/', function(req, res, next) {
  res.send('DELETE');
});

// TEST: temporary 500 trigger — DELETE after testing!
router.get('/boom', function(req, res, next) {
  throw new Error('Boom! testing users 500 handler');
});

router.use(notFoundHandler);
router.use(errorHandler);

module.exports = router;
