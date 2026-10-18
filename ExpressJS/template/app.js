var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var birdsRouter = require('./routes/birds');
var timeReqRouter = require('./index.cjs');
var Bread = require('./models/bread');

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

// Errors in synchronous code
app.get('/catchErr', (req, res) => {
  throw new Error('This is an error!');
});

app.get('/breads/:breadId', async (req, res, next) => {
  try {
    const bread = await Bread.findById(req.params.breadId);

    if (!bread) {
      const err = new Error('Bread not found');
      err.status = 404;
      throw err;
    }
    res.send(bread);
  } catch (err) {
    next(err);
  }
});

// Working with promise chains
app.get('/catchErr1',async (req, res) => {
  return Promise.resolve().then(() => {

    throw new Error('Promise error!');
  });
});

app.get('/catchErr2',async (req, res,next) => {
  Promise.resolve().then(() => {

    throw new Error('Promise 2 error!');
  })
    .catch(next);
});

// Working with callback APIs
const fs=require('fs');
app.get('/callback', (req, res,next) => {
  fs.readFile('//workspaces/ExpressJS/README.md', (err, data) => {
    if (err) {
      next(err);
    } else {
      res.send(data);
    }
  });
});

app.get('/callback1',[ (req, res,next) => {
  fs.writeFile('//workspaces/ExpressJS/README.md', 'data', next);
},

  (req, res) => {
    res.send('File written successfully');
  },
]);

app.get('/callback2',[ (req, res,next) => {
  fs.readFile('//workspaces/ExpressJS/ExpressJS/template/persons.txt', 'utf-8', (err, data) => {
    res.locals.data = data;
    next(err);
  });
},

  (req, res) => {
    res.locals.data=res.locals.data.split(',');
    res.send(res.locals.data);
  },
]);

app.get('/callback3', (req, res,next) => {
  setTimeout(() => {
    try {
      throw new Error('This is an error from setTimeout!');
    } catch (err) {
      next(err);
    }
  }, 500);
});

// Writing error handlers

app.get('/eh', (req, res, next) => {
  if (!req.user.hasPaid) {
    const err = new Error('Payment required');
    err.status = 402;
    next(err);
  }
  else {
    next();
  }
},
  (req, res, next) => {
    PaidContent.find((err,doc) => {
      if (err) {
        return next(err);
        res.json
      } 
    );
  }
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
