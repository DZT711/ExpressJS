const exp = require('express');
const app = exp.Router();
const cookieParser = require('cookie-parser');
const cookieValidator = require('cookie-validator');
// const mw = require('./mymiddleware.cjs');
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

// async function validateCookie(req, res, next) {
//   await cookieValidator(req, cookies);
//   next();
// }

// app.use(cookieParser());
// app.use(validateCookie);
// app.use((err, req, res, next) => {
//   if (err) {
//     res.status(400).send('Invalid cookie');
//   } else {
//     next();
//   }
// });
// app.use(mw({ option1: 'value1', option2: 'value2' }));
module.exports = app;

