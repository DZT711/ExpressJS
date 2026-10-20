const exp = require('express');
const app = exp.Router();
const cookieParser = require('cookie-parser');
const mw = require('./mymiddleware.cjs');

const expireDate = new Date(Date.now() + 60 * 60* 1000); // 1 minute from now

// GET http://localhost:3000/reqtime

const reqTime = (req, res, next) => {
  req.reqTime = Date.now();
  next();
};
// curl -i -c /tmp/session-cookies.txt http://localhost:3000/reqtime/session-test
// curl -i -b /tmp/session-cookies.txt -c /tmp/session-cookies.txt http://localhost:3000/reqtime/session-test
// const session=require('express-session');
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: false,
//   // cookie: { secure: true }
//   name: 'sessionId'
// }));

// app.use(session({
//   name:'session',
//   keys: ['key1', 'key2'],
//   cookie: {
//     secure: true,
//     httpOnly: true,
//     domain: 'example.com',
//     path:'foo/bar',
//     expires: expiryDate,
//     // maxAge: 60 * 60 * 1000, // 1 hour
//     // sameSite: 'strict'
//   }
// }
// ));

// curl -i -c /tmp/session-cookies.txt http://localhost:3000/reqtime/session-test
// curl -i -b /tmp/session-cookies.txt -c /tmp/session-cookies.txt http://localhost:3000/reqtime/session-test
const session=require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  name: 'session',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    domain: process.env.SESSION_COOKIE_DOMAIN,
    path: '/',
    maxAge: 60 * 60 * 1000,
    sameSite: 'strict'
  }
}));
app.use(reqTime);
app.get('/session-test', (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.json({ views: req.session.views });
});
app.get('/', (req, res) => {
    let reqText = 'Hello World!<br>';
    reqText += `<p>You requested at : ${req.reqTime}</p>`;
    res.send(reqText);
});

app.use(cookieParser());
app.use(mw({ option1: 'value1', option2: 'value2' }));
module.exports = app;

