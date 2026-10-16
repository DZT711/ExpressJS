var express = require('express');
var router = express.Router();
var handleErrors = require('../middleware/errorHandler');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// all request methods 
router.post('/', function(req, res, next) {
  res.send('POST');
});
router.put('/', function(req, res, next) {
  res.send('PUT');
});
router.delete('/', function(req, res, next) {
  res.send('DELETE');
});


// simple error handling middleware (commented out because we are using a custom error handler in middleware/errorHandler.js)

// router.use((req, res, next) => {
//   res.status(404).send('Are you stupid?');
// });
// router.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });


// TEST: 404 + 500 + /boom trigger all mounted by ONE call — see middleware/errorHandler.js
handleErrors(router);



module.exports = router;
