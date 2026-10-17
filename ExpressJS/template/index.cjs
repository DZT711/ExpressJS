const exp = require('express');
const app = exp.Router();

// GET http://localhost:3000/reqtime

const reqTime = (req, res, next) => {
  req.reqTime = Date.now();
  next();
};

app.use(reqTime);
app.get('/', (req, res) => {
    let reqText = 'Hello World!<br>';
    reqText += `<p>You requested at : ${req.reqTime}</p>`;
    res.send(reqText);
});

module.exports = app;

