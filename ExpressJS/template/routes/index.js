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

// comment handleErrors(router) before test this code block; // moved to users.js to avoid duplicate 404/500 handlers

router.all('/secret', (req, res, next) => {
  console.log('secret route hit');
  next(new Error('Secret route error!'));
});

// Regular expressions
// router.get(/a/, (req, res) => {
//   res.send('Matched a route with "a" in the path!');
// });
// router.get(/.*b$/, (req, res) => {
//   res.send('Matched a route ending with "b"!');
// });

// Named parameters

router.get('/books/:bookId', (req, res) => {
  res.send(req.params.bookId);
})

//Wildcards (Express 5 named wildcard: req.params.filepath is an array)
// GET http://localhost:3000/files/readme.txt

router.get('/files/{*filepath}', (req, res) => {
  console.dir(req.params.filepath);
  res.send(`File: ${req.params.filepath.join('/')}`);
})

// router.get('/{*splat}', (req, res) => {
//   res.send('ok');
// })

//Optional segments
// GET http://localhost:3000/readme.md
router.get('/:file{.:ext}', (req, res) => {
  res.send('ok');
})

// TEST: 404 + 500 + /boom trigger all mounted by ONE call — MUST BE LAST
handleErrors(router);

module.exports = router;
