const sqlite3 = require('sqlite3').verbose();
const express = require('express');

const router = express.Router();

// ---------------------------------------------------------------------------
// Database connection (SQLite via sqlite3)
// ---------------------------------------------------------------------------
// Prefer a file-based DB via DATABASE_PATH; fall back to an in-memory DB so
// the example works out of the box without any setup. Never hardcode secrets
// (e.g. passwords) in source — use environment variables instead.
const dbPath = process.env.DATABASE_PATH || ':memory:';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(`Failed to open database at ${dbPath}:`, err.message);
    process.exit(1);
  }
  console.log(`Connected to the ${dbPath} database.`);
});

// Seed the schema once when the module loads. All identifiers are static so
// there is no injection risk here; user-supplied values always use placeholders
// (see the routes below).
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS persons (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL,
       age INTEGER
     )`
  );
  db.run(
    `INSERT INTO persons (name, age) VALUES (?, ?)`,
    ['John Doe', 30]
  );
  db.run(
    `INSERT INTO persons (name, age) VALUES (?, ?)`,
    ['Jane Smith', 25]
  );
});

// ---------------------------------------------------------------------------
// Routes — full CRUD over the `persons` table
// Mounted by app.js at /db  (e.g. GET /db, GET /db/1, POST /db)
// ---------------------------------------------------------------------------

// GET /db — list all persons
router.get('/', (req, res, next) => {
  db.all('SELECT * FROM persons ORDER BY id', [], (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

// GET /db/:id — get a single person by id
router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    const err = new Error('Invalid person id');
    err.status = 400;
    return next(err);
  }
  db.get('SELECT * FROM persons WHERE id = ?', [id], (err, row) => {
    if (err) return next(err);
    if (!row) {
      const err = new Error('Person not found');
      err.status = 404;
      return next(err);
    }
    res.json(row);
  });
});

// POST /db — create a new person  (body: { name, age })
// express.json() is already mounted globally in app.js; keep a safe fallback
// for clients that omit Content-Type: application/json.
router.post('/', (req, res, next) => {
  const { name, age } = req.body || {};
  if (!req.body || !name || typeof name !== 'string') {
    const err = new Error('Request body must be JSON with a "name" field');
    err.status = 400;
    return next(err);
  }
  db.run(
    'INSERT INTO persons (name, age) VALUES (?, ?)',
    [name, age || null],
    function (err) {
      if (err) return next(err);
      res.status(201).json({ id: this.lastID, name, age });
    }
  );
});

// PUT /db/:id — update a person  (body: { name?, age? })
router.put('/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    const err = new Error('Invalid person id');
    err.status = 400;
    return next(err);
  }
  const { name, age } = req.body || {};
  const updates = [];
  const params = [];
  if (name !== undefined) {
    updates.push('name = ?');
    params.push(name);
  }
  if (age !== undefined) {
    updates.push('age = ?');
    params.push(age);
  }
  if (updates.length === 0) {
    const err = new Error('Nothing to update');
    err.status = 400;
    return next(err);
  }
  params.push(id);
  db.run(
    `UPDATE persons SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function (err) {
      if (err) return next(err);
      if (this.changes === 0) {
        const err = new Error('Person not found');
        err.status = 404;
        return next(err);
      }
      res.json({ id, changes: this.changes });
    }
  );
});

// DELETE /db/:id — delete a person
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    const err = new Error('Invalid person id');
    err.status = 400;
    return next(err);
  }
  db.run('DELETE FROM persons WHERE id = ?', [id], function (err) {
    if (err) return next(err);
    if (this.changes === 0) {
      const err = new Error('Person not found');
      err.status = 404;
      return next(err);
    }
    res.json({ id, deleted: true });
  });
});

// ---------------------------------------------------------------------------
// Connection lifecycle
// ---------------------------------------------------------------------------
// Keep the connection open for the lifetime of the app (do NOT call
// db.close() right after db.serialize — that would close the DB before any
// request arrives). Close gracefully when the process shuts down.
function closeDatabase() {
  db.close((err) => {
    if (err) console.error('Error closing the database:', err.message);
    else console.log('Closed the database connection.');
  });
}

process.on('SIGINT', closeDatabase);
process.on('SIGTERM', closeDatabase);

module.exports = router;
module.exports.db = db;