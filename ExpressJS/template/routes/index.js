var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

// TEST: trigger the 500 handler below — DELETE after testing!
// router.get('/boom', function(req, res, next) {
//   throw new Error('Boom! testing Something broke!');
// });

router.use((req, res, next) => {
  res.status(404).send('Are you stupid?');
});
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
module.exports = router;
