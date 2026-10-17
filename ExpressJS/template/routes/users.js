var express = require('express');
var router = express.Router();
var handleErrors = require('../middleware/errorHandler');

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

// Named parameters
router.get('/:userId', (req, res) => {
  res.send(req.params.userId);
})
// TEST: 404 + 500 + /boom trigger all mounted by ONE call — see middleware/errorHandler.js
handleErrors(router);

module.exports = router;
