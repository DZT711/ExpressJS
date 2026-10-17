const express = require('express');
const router = express.Router();

const timeLog = (req, res, next) => {
    next();
}
router.use(timeLog);
router.get('/', function(req, res) {
  res.send('bird home page');
});
router.get('/about', function(req, res) {
  res.send('about bird page');
});
module.exports = router;