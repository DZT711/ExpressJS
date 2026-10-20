var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const FS = require('fs');
const sqlite3 = require('sqlite3').verbose();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var birdsRouter = require('./routes/birds');
var dbRouter = require('./routes/db');
var timeReqRouter = require('./index.cjs');
var Bread = require('./models/bread');
const { Worker } = require('worker_threads');
const wkpath = require('path');
const piscina = require('piscina');
const pool = new piscina({
  filename: wkpath.resolve(__dirname, 'resizeWorker.js')
});
var app = express();
const compression = require('compression');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());


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

// Dữ liệu user giả lập
app.use((req, res, next) => {
  req.user = {
    id: 1,
    hasPaid: req.query.paid === 'true'
  };

  next();
});

// Dữ liệu nội dung trả phí giả lập
const PaidContent = [
  {
    id: 1,
    title: 'ExpressJS',
    content: 'Middleware và routing'
  },
  {
    id: 2,
    title: 'Node.js',
    content: 'Xử lý bất đồng bộ'
  }
];


app.get('/errorhandling', (req, res, next) => {
  if (!req.user || !req.user.hasPaid) {
    const err = new Error('Payment required');
    err.status = 402;
    next(err);
  }
  else {
    next();
  }
},
  (req, res, next) => {
    PaidContent.find((err, doc) => {
      if (err) {
        return next(err);
      }
      res.json(doc);
    });
  }
);
app.engine('ntl', (filePath, options, callback) => {
  FS.readFile(filePath, (err, content) => {
    if (err) return callback(err);
    const rendered = content.toString().replace('#title#', '' + options.title + '').replace('#message#', '' + options.message + '');
    return callback(null, rendered);
  });
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ntl');

app.get('/ntl', (req, res) => {
  res.render('index', { title: 'My Page', message: 'Hello, World!' });
});

// performance optimization
app.get('/search', (req, res) => {
  setImmediate(() => {
    const jsonStr = JSON.stringify({ message: 'Search results' });
    try {
      const jsonObj = JSON.parse(jsonStr);
      res.send('success');
    }
    catch (err) {
      res.status(400).send('Invalid JSON format');
    }
  }
  )
});

// ---------------------------------------------------------------------------
// User data for the /optimize route (SQLite table).
// ---------------------------------------------------------------------------
// A file-based database is used so the `users` table persists across
// connections (a ':memory:' database is private to each connection).
const userDbPath = process.env.USER_DB_PATH || path.join(__dirname, 'data', 'users.db');
const userDb = new sqlite3.Database(userDbPath, (err) => {
  if (err) {
    console.error(`Failed to open user database at ${userDbPath}:`, err.message);
    process.exit(1);
  }
  console.log(`Connected to the ${userDbPath} user database.`);
});

const { promisify } = require('util');

let userData;
userDb.serialize(() => {
  userDb.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL
    )
  `);

  // Idempotent seed (safe on every restart: UNIQUE email + OR IGNORE).
  const insert = userDb.prepare(
    'INSERT OR IGNORE INTO users (name, email, role) VALUES (?, ?, ?)'
  );
  for (const user of [
    ['Alice Nguyen', 'alice@example.com', 'admin'],
    ['Bob Tran', 'bob@example.com', 'user'],
    ['Carol Le', 'carol@example.com', 'user'],
  ]) {
    insert.run(user);
  }
  insert.finalize();

  // Queued after table creation + seeding, so `userData` always resolves to
  // the seeded users. Matches `await userData` in the /optimize route.
  userData = promisify(userDb.all.bind(userDb))(
    'SELECT id, name, email, role FROM users ORDER BY id'
  );
});

// Close the database gracefully when the process shuts down.
process.on('SIGINT', () => userDb.close());
process.on('SIGTERM', () => userDb.close());

app.get('/optimize', async (req, res, next) => {
  const data = await userData;
  res.send(data);
});
// userDb.close((err) => {
//   if (err) {
//     console.error('Error closing the user database:', err.message);
//   } else {
//     console.log('User database connection closed.');
//   }
// });
app.use((err,req,res,next) => {
  res.status(err.status??500).send(`Error: ${err.message}`);
});

// Use worker threads (piscina pool) for CPU-intensive tasks
app.post('/resize', (req, res, next) => {
  const imageData = req.body && req.body.imageData;
  if (imageData === undefined) {
    const err = new Error('imageData is required');
    err.status = 400;
    return next(err);
  }

  pool
    .run(imageData)
    .then((result) => res.json(result))
    .catch((err) => next(err));
});

app.use('/users', usersRouter);
app.use('/birds', birdsRouter);
app.use('/reqtime', timeReqRouter);
app.use('/index', indexRouter);
app.use('/db', dbRouter);
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
  res.render('error', { title: 'Error', message: err.message });
});



module.exports = app;
