var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var birdsRouter = require('./routes/birds');
var timeReqRouter = require('./index.cjs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware mounted on a path
app.use('/users/:userId',(req,res,next)=>{
  console.log('Request Type:', req.method);
  next();
});

// Middleware sub-stacks
app.use('/index/', (req, res, next) => {
  console.log('Request Type:', req.method);
  next();
},
  (req, res, next) => {
    console.log('Request URL:', req.originalUrl);
    next();
});

// Multiple route handlers
app.get('/examples/:exampleId', (req, res, next) => {
    console.log('ID:', req.params.exampleId);
    next();
  }, (req, res) => {
  res.send('example Info');
  // next();
  }
);
// req handler
// app.get('/examples/:exampleId', (req, res) => {
//   res.send(req.params.exampleId);
// });

// Skipping to the next route
app.get('/peoples/:peopleId', (req, res,next) => {
  if (req.params.peopleId === '0') next('route');
  else next();
}, (req, res) => {
  res.send('regular');
});
// req handler
app.get('/peoples/:peopleId', (req, res) => {
  res.send('special');
});



app.use('/users', usersRouter);
app.use('/birds', birdsRouter);
app.use('/reqtime', timeReqRouter);
app.use('/index', indexRouter);

// Middleware function myLogger
const Logger = (req, res, next) => {
  console.log('LOGGED')
  next();
}
app.use(Logger);
app.get('/', (req, res) => {
  res.send('Hi Devs');
});

// const reqTime = (req, res, next) => {
//   req.reqTime = Date.now();
//   next();
// };

// app.use(reqTime);
// app.get('/testreqTime', (req, res) => {
//     let reqText = 'Hello World!<br>';
//     reqText += `<p>You requested at : ${req.reqTime}</p>`;
//     req.setEncoding(reqText);
// });



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
