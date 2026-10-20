<div align="center">

# 🚂 Express.js Learning Lab

### Express 5 • TypeScript • SQLite • Worker Threads • API Reference Testing

A progressive, hands-on exploration of Express.js — from a minimal TypeScript server to a fully tested Express 5 API reference implementation and a production-pattern playground covering routing, databases, sessions, security, and performance.

<br/>

[![Express](https://img.shields.io/badge/Express-5.3.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A520.19.3-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-6.0.1-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

<br/>

[![Pug](https://img.shields.io/badge/Pug-3.0.4-A86454?style=flat-square&logo=pug&logoColor=white)](https://pugjs.org/)
[![Helmet](https://img.shields.io/badge/Helmet-8.3.0-FF6600?style=flat-square)](https://helmetjs.github.io/)
[![Piscina](https://img.shields.io/badge/Piscina-5.3.2-blue?style=flat-square)](https://github.com/piscinajs/piscina)
[![Morgan](https://img.shields.io/badge/Morgan-Logger-lightgrey?style=flat-square)](https://www.npmjs.com/package/morgan)
[![express--session](https://img.shields.io/badge/express--session-1.19.0-grey?style=flat-square)](https://www.npmjs.com/package/express-session)
[![Node Test Runner](https://img.shields.io/badge/Testing-node%3A%2Ftest-43853D?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/api/test.html)

<br/>

![Learning](https://img.shields.io/badge/Project-Learning_&_Reference-blue?style=flat-square)
![Bilingual](https://img.shields.io/badge/Docs-English_%2F_Tiếng_Việt-orange?style=flat-square)
![Status](https://img.shields.io/badge/Status-Ongoing-success?style=flat-square)

<br/>

[Overview](#-overview) •
[Sub-Projects](#-sub-projects) •
[API Reference Lab](#-1-api-reference-fully-tested-express-5-reference) •
[TypeScript Starter](#-2-expressjs-typescript-starter) •
[Feature Playground](#-3-expressjstemplate-production-pattern-playground) •
[Pug Demo](#-4-pug-template-engine-demo) •
[What I've Learned](#-what-ive-learned) •
[Getting Started](#-getting-started) •
[Tech Stack](#-full-technology-stack)

</div>

---

# 📖 Overview

This repository is a structured, incremental study of **Express.js 5**, organized into four distinct sub-projects that build on each other in complexity:

```text
Complexity
   │
   │                                           ┌─────────────────────┐
   │                                           │  ExpressJS/template  │
   │                                           │  (production         │
   │                                           │   patterns)          │
   │                              ┌────────────┴─────────────┐
   │                              │      API-Reference         │
   │                              │  (full Express 5 API,      │
   │                              │   tested over HTTP)        │
   │             ┌────────────────┴──────────────┐
   │             │     ExpressJS (TypeScript)      │
   │             │        minimal starter          │
   │    ┌────────┴───────┐
   │    │       pug        │
   │    │  template engine │
   │    │       demo        │
   └────┴──────────────────────────────────────────────────────────► Time
```

Every sub-project uses **Express 5.3.0**, which keeps API behavior consistent across the repository while the surrounding tooling (TypeScript, SQLite, sessions, worker threads, security middleware) varies by project.

> [!NOTE]
> This is a personal learning and reference repository, not a single deployable application. Each sub-folder is runnable independently and documents a different layer of Express.js knowledge.

---

# 🗂 Sub-Projects

| Project | Purpose | Key Technologies | Tested? |
|---|---|---|:---:|
| [`API-Reference/`](#-1-api-reference-fully-tested-express-5-reference) | Complete, runnable Express 5 API reference with bilingual docs | Express 5, cookie-parser, custom view engine | ✅ Yes |
| [`ExpressJS/`](#-2-expressjs-typescript-starter) | Minimal TypeScript + Express 5 starter | TypeScript 7, `@types/express` | — |
| [`ExpressJS/template/`](#-3-expressjstemplate-production-pattern-playground) | Large feature playground: routing, DB, sessions, security, workers | SQLite3, Piscina, Helmet, express-session, Jade | Partial (load test) |
| [`pug/`](#-4-pug-template-engine-demo) | Minimal Pug templating example | Pug 3 | — |

---

# 🌟 1. API-Reference — Fully Tested Express 5 Reference

**Location:** [`API-Reference/`](API-Reference/)

This is the most rigorous sub-project in the repository: a **runnable, tested companion to the official Express 5 API Reference**, written in original code and verified with real HTTP requests rather than copied documentation prose.

### Highlights

- 📄 Bilingual documentation (English / Tiếng Việt) across 6 markdown files.
- 🧪 Full integration test suite using Node's **built-in test runner** (`node --test`) — no external test framework.
- 🌐 Tests send real HTTP requests via `fetch()` against an ephemeral local port.
- 🗺 Covers **every major section** of the Express 5 API: the `express()` factory, Application, Request, Response, and Router objects.

### Structure

```text
API-Reference/
├── README.md                  # Bilingual usage guide + full API coverage map
├── docs/
│   ├── express-object.md      # express(), middleware factories, Router factory
│   ├── application.md         # app.* properties, methods, settings
│   ├── request.md             # req.* properties and methods
│   ├── response.md            # res.* properties and methods
│   └── router.md              # Router factory, flow control, matching
├── src/
│   ├── app.cjs                # All example routes and middleware
│   ├── server.cjs             # HTTP server + graceful shutdown
│   ├── public/sample.txt      # Static file fixture
│   └── views/greeting.ref     # Custom view-engine fixture
└── test/
    └── api.test.cjs           # End-to-end HTTP assertions
```

### API Coverage Map

| Chapter | What's Demonstrated | Example Route |
|---|---|---|
| `express()` factory | App creation, middleware factories | `createApp()` |
| `express.json/urlencoded/text/raw()` | Body parsing per content type | `POST /api/body/*` |
| `express.static()` | Serving files from a mounted path | `GET /assets/sample.txt` |
| `express.Router()` | `caseSensitive`, `strict`, `mergeParams` options | `/api`, nested router |
| Application object | `app.locals`, `app.mountpath`, `app.on('mount')`, `app.param()`, `app.route()`, `app.engine()` | `GET /application` |
| Request object | `req.params`, `req.query`, `req.ip`, `req.fresh`, `req.range()`, `req.accepts()` | `GET /api/request/:id` |
| Response object | `res.cookie()`, `res.format()`, `res.jsonp()`, `res.sendFile()`, `res.download()` | `/api/response/*` |
| Router object | `router.param()`, `router.route()`, `next('route')`, `next('router')`, regex routes | `/api/flow/*`, `/api/commits/...` |

### Custom View Engine

The lab registers a tiny custom template engine for `.ref` files directly via `app.engine()`:

```javascript
app.engine('ref', (filePath, options, callback) => {
  fs.readFile(filePath, 'utf8', (error, template) => {
    if (error) return callback(error);
    const rendered = template
      .replaceAll('{{name}}', String(options.name ?? 'reader'))
      .replaceAll('{{section}}', String(options.section ?? 'Express API'));
    callback(null, rendered);
  });
});
```

This demonstrates that Express's templating system is engine-agnostic — any function matching the `(path, options, callback)` signature can be registered.

### Running It

```bash
cd API-Reference
npm install
npm test     # runs the full HTTP-based integration suite
npm start    # starts the reference server on :3000
```

```bash
curl -i http://localhost:3000/application
curl -i 'http://localhost:3000/api/request/42?mode=fast'
curl -i -X POST http://localhost:3000/api/body/json \
  -H 'Content-Type: application/json' -d '{"topic":"routing"}'
```

> [!IMPORTANT]
> Requires **Node.js `>=20.19.3 <21`** or **`>=22.2.0`** — this range is enforced in `package.json` `engines`, likely because the lab exercises the experimental HTTP **`QUERY`** method (`app.query()`, `router.query()`), which needs a sufficiently recent Node.js version.

---

# 🧪 2. ExpressJS — TypeScript Starter

**Location:** [`ExpressJS/`](ExpressJS/)

A minimal but strictly typed Express 5 server, used as a sandbox for modern TypeScript + ESM configuration.

### Source

```typescript
import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
```

### Notable Configuration Choices

This project uses an unusually modern `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "rewriteRelativeImportExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "strict": true
  }
}
```

| Option | What It Practices |
|---|---|
| `module: "nodenext"` | Native Node.js ESM resolution semantics |
| `rewriteRelativeImportExtensions` | Lets you import `./app.ts` and have it rewritten to `./app.js` in output |
| `erasableSyntaxOnly` | Restricts to TypeScript syntax that compiles away with **no runtime transform** (e.g., disallows `enum`, parameter properties) |
| `verbatimModuleSyntax` | Forces explicit `import type` for type-only imports |
| `type: "module"` in `package.json` | Runs as native ESM, not CommonJS |

> [!NOTE]
> `typescript: ^7.0.2` is a notably bleeding-edge pin — TypeScript 7 represents the native (Go-based) compiler rewrite. Combined with `erasableSyntaxOnly`, this setup is clearly exploring **type-stripping-friendly** TypeScript — code that could theoretically run directly in Node.js without a build step.

### Scripts

```bash
cd ExpressJS
npm install

npm run dev        # run src/app.ts directly via ts-node/esm loader
npm run build       # compile to dist/ via tsc
npm start          # run compiled dist/app.js
npm run typecheck   # tsc --noEmit
```

---

# 🏗️ 3. ExpressJS/template — Production-Pattern Playground

**Location:** [`ExpressJS/template/`](ExpressJS/template/)

This is the largest and most feature-dense sub-project — an Express-generator-style app extended with dozens of deliberate experiments in routing, error handling, middleware, database access, sessions, security, and concurrency.

## 🧭 Feature Map

```text
ExpressJS/template/
│
├── app.js                     ← central hub wiring everything together
├── loadtest.mjs                ← custom concurrent HTTP load tester
├── mymiddleware.cjs             ← middleware factory pattern
├── resizeWorker.js              ← CPU-bound task offloaded to worker threads
├── index.cjs                   ← session handling + request-time middleware
│
├── middleware/
│   └── errorHandler.js          ← reusable 404/500/boom error module factory
│
├── models/
│   └── bread.js                 ← in-memory "model" with findById()
│
├── routes/
│   ├── index.js                 ← routing pattern showcase (see below)
│   ├── users.js                 ← named params + shared error handling
│   ├── birds.js                 ← simple router + path-scoped middleware
│   └── db.js                    ← full SQLite CRUD API
│
├── types/
│   └── express.d.ts              ← Express Request type augmentation
│
└── views/
    ├── layout.jade / index.jade / error.jade   ← Jade templating
    └── index.ntl / error.ntl                    ← custom ".ntl" engine
```

## 🔀 Routing Patterns Demonstrated

`routes/index.js` is essentially a **catalog of every Express 5 routing capability**:

| Pattern | Example Route | What It Shows |
|---|---|---|
| Named parameters | `GET /books/:bookId` | Basic `req.params` |
| **Express 5 named wildcard** | `GET /files/{*filepath}` | `req.params.filepath` as an **array** |
| Optional parameter segment | `GET /papers/{:paperId}` | Parameter that may be entirely absent |
| Optional path segment | `GET /rules{/:ruleId}` | Whole `/segment` is optional |
| Route skipping | `GET /pens/:penId` (`id === '0'`) | `next('route')` falls through to a second handler |
| Multiple route handlers | `GET /examples/:exampleId` | Chaining two handler functions on one route |
| Handler arrays | `GET /example/c` | `[cb0, cb1, cb2]` array-of-middleware pattern |
| Chained route methods | `/book` | `router.route().get().post().put()` |
| Deliberate error trigger | `ALL /secret` | `next(new Error(...))` for testing error middleware |

### Express 5 Wildcard Syntax in Practice

```javascript
// GET /files/readme.txt
router.get('/files/{*filepath}', (req, res) => {
  console.dir(req.params.filepath);
  res.send(`File: ${req.params.filepath.join('/')}`);
});
```

This is Express 5's updated **named wildcard** syntax (`{*name}`), replacing Express 4's bare `*` — a direct, hands-on exploration of what changed in the Express 5 routing engine.

## ⚠️ Error Handling Catalog

`app.js` systematically works through **every major JavaScript error-propagation shape** Express needs to handle:

| Scenario | Route | Technique |
|---|---|---|
| Synchronous throw | `GET /catchErr` | Thrown inside a sync handler — Express 5 catches this automatically |
| Async/await + try/catch | `GET /breads/:breadId` | Manual `try { } catch (err) { next(err) }` |
| Unhandled promise rejection | `GET /catchErr1` | Returned promise rejection — Express 5 auto-forwards |
| Promise chain with `.catch(next)` | `GET /catchErr2` | Explicit `.catch(next)` |
| Callback-style API (Node `fs`) | `GET /callback`, `/callback1`, `/callback2` | Classic `(err, data) => next(err)` pattern |
| Delayed/async error (`setTimeout`) | `GET /callback3` | Error thrown inside a timer callback, manually forwarded |
| Centralized reusable handler | `middleware/errorHandler.js` | A **factory function** mounting 404 + 500 + an optional `/boom` trigger in one call |

### The Reusable Error Handler Pattern

```javascript
function handleErrors(router, options = {}) {
  const { boomPath = '/boom', boomMessage, notFoundMessage, errorMessage, logErrors } = options;

  if (boomPath) {
    router.get(boomPath, boomMessage !== undefined ? createBoom(boomMessage) : boom500);
  }
  router.use(notFoundMessage !== undefined ? createNotFoundHandler(notFoundMessage) : notFoundHandler);
  router.use(errorMessage !== undefined || logErrors !== undefined
    ? createErrorHandler({ message: errorMessage, log: logErrors })
    : errorHandler);
  return router;
}
```

One call — `handleErrors(router)` — mounts a consistent 404 handler, 500 handler, and an optional deliberate-crash route for testing, and is reused identically in both `routes/index.js` and `routes/users.js`.

## 🗄️ Database Integration (SQLite3)

Two separate SQLite integrations exist in this project, each demonstrating a different pattern:

### `routes/db.js` — Full CRUD Router

```text
GET    /db          → list all persons
GET    /db/:id       → get one person
POST   /db           → create person
PUT    /db/:id       → update person
DELETE /db/:id       → delete person
```

Notable practices:
- **Parameterized queries** everywhere (`?` placeholders) — no string-concatenated SQL.
- **Idempotent seeding** on startup using `INSERT OR IGNORE` + a `UNIQUE` email constraint.
- Graceful connection shutdown on `SIGINT`/`SIGTERM`.
- Configurable DB path via `DATABASE_PATH` env var, defaulting to `:memory:`.

### `app.js` — Promisified Query Pattern

```javascript
const { promisify } = require('util');

userData = promisify(userDb.all.bind(userDb))(
  'SELECT id, name, email, role FROM users ORDER BY id'
);

app.get('/optimize', async (req, res, next) => {
  const data = await userData;
  res.send(data);
});
```

This demonstrates converting a callback-based SQLite API into a `Promise` with Node's built-in `util.promisify`, then consuming it with `async/await` inside a route handler.

## ⚙️ Worker Threads for CPU-Bound Work

`resizeWorker.js` + `piscina` demonstrate offloading CPU-intensive work off the main event loop:

```javascript
const piscina = require('piscina');
const pool = new piscina({ filename: path.resolve(__dirname, 'resizeWorker.js') });

app.post('/resize', (req, res, next) => {
  const imageData = req.body?.imageData;
  if (imageData === undefined) {
    const err = new Error('imageData is required');
    err.status = 400;
    return next(err);
  }

  pool.run(imageData)
    .then((result) => res.json(result))
    .catch((err) => next(err));
});
```

```text
HTTP Request
     │
     ▼
Express Route Handler
     │
     ▼
Piscina Worker Pool  ──────►  Worker Thread (resizeWorker.js)
     │                              │
     │◄─────────────────────────────┘
     ▼
res.json(result)
```

This is a practical pattern for keeping the Express event loop responsive while heavy computation (image processing, in this placeholder case) happens in a separate thread.

## 🔐 Sessions & Security

| Concern | Package | Where |
|---|---|---|
| Session storage | `express-session` | `index.cjs` — `/reqtime/session-test` |
| Response compression | `compression` | `app.js` |
| Security headers | `helmet` | `app.js` |
| Disabling fingerprinting | `app.disable('x-powered-by')` | `app.js` |
| Trusted proxy configuration | `app.set('trust proxy', 1)` | `app.js` + dedicated [`trustProxy.md`](ExpressJS/template/trustProxy.md) |
| Cookie parsing | `cookie-parser` | `app.js`, `index.cjs` |

### Session Example

```javascript
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  name: 'session',
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: 'strict'
  }
}));

app.get('/session-test', (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.json({ views: req.session.views });
});
```

Tested manually with cookie-jar persistence across requests:

```bash
curl -i -c /tmp/session-cookies.txt http://localhost:3000/reqtime/session-test
curl -i -b /tmp/session-cookies.txt -c /tmp/session-cookies.txt http://localhost:3000/reqtime/session-test
```

### `trustProxy.md` — A Full Study Note

This project includes a dedicated markdown file explaining every mode of Express's `trust proxy` setting: Boolean, IP/subnet, hop-count number, and custom function — including the security warning about spoofable `X-Forwarded-*` headers when proxy trust is misconfigured.

## 🎨 Custom & Standard View Engines

Two template engines are registered side by side:

```javascript
app.set('view engine', 'jade');     // standard, well-known engine

app.engine('ntl', (filePath, options, callback) => {
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err);
    const rendered = content.toString()
      .replace('#title#', options.title)
      .replace('#message#', options.message);
    callback(null, rendered);
  });
});
```

This mirrors the `API-Reference` project's custom engine experiment, but with a different (even simpler) placeholder-replacement syntax, applied to `.ntl` files.

## 🧵 TypeScript-Style Request Augmentation (in a JS Project)

Even though `template/` is plain JavaScript, it includes a `.d.ts` file to document an intended `Request` extension via declaration merging:

```typescript
declare global {
  namespace Express {
    interface Request {
      requestTime?: number;
    }
  }
}
export {};
```

This is the standard pattern for safely adding custom properties (like `req.requestTime`) to Express's `Request` interface in a TypeScript-aware codebase.

## 📊 Custom Load Testing Script

`loadtest.mjs` is a **hand-written**, dependency-free concurrent load tester — not Artillery, not k6, not autocannon — built entirely on `fetch()` and `Promise`.

```text
┌──────────────┐     spawn worker tasks     ┌──────────────┐
│ N total reqs │ ─────────────────────────► │ C concurrent │
│              │                            │   "workers"   │
└──────────────┘                            └──────┬───────┘
                                                    │
                                     each worker loops, picking
                                     the next unclaimed request
                                                    │
                                                    ▼
                                       records latency + pass/fail
                                       per route, then aggregates
                                       min/avg/p50/p95/max
```

Features:
- Configurable via environment variables: `N` (total requests), `C` (concurrency), `URL`, `SHOW_BODY`, `VERIFY`.
- Validates both **status code** and **response body** per route (string or `RegExp` match).
- Computes **p50 / p95** latency percentiles per route and overall.
- Prints a readable per-route results table plus up to 20 captured failures.

```bash
cd ExpressJS/template
node loadtest.mjs
# or tune it:
N=1000 C=100 URL=http://localhost:3000 node loadtest.mjs
```

### Running the Playground

```bash
cd ExpressJS/template
npm install
npm start               # node ./bin/www
# or, with auto-reload:
npx nodemon ./bin/www
```

> [!WARNING]
> `package.json`'s `start` script points to `./bin/www`, and `app.js` is written in the classic **Express-generator style** (exporting the app for a separate server bootstrap file to consume). However, **no `bin/www` file was included** in the repository snapshot used to write this README. If you're missing this file, you can create a minimal one, or start the exported `app` directly from a small script that calls `app.listen(PORT)`.

> [!NOTE]
> `app.js` opens a SQLite database at `data/users.db` by default (`USER_DB_PATH` env var to override). The `data/` directory was not present in the provided repository structure — create it manually, or set `USER_DB_PATH=:memory:` for a disposable database.

---

# 🎨 4. Pug Template Engine Demo

**Location:** [`pug/`](pug/)

A minimal, focused demonstration of Express's templating system using **Pug** (the successor to Jade).

```javascript
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Pug Template Example',
    message: 'Hello, Pug!'
  });
});

app.listen(3000);
```

```pug
html
  head
    title= title
  body
    h1= message
```

### Running It

```bash
cd pug
npm install
npm run dev     # nodemon app.js
```

---

# 📚 What I've Learned

This section consolidates concrete Express.js and Node.js concepts practiced across all four sub-projects, with direct references to source files.

## 1. 🧩 Express Application Fundamentals

| Concept | Files |
|---|---|
| Creating an app with `express()` | `ExpressJS/src/app.ts`, `API-Reference/src/app.cjs` |
| `app.listen()` and graceful shutdown (`SIGINT`/`SIGTERM`) | `API-Reference/src/server.cjs` |
| App settings (`app.set`, `app.get`, `app.enable`, `app.disable`) | `API-Reference/src/app.cjs`, `template/app.js` |
| `app.locals` vs `res.locals` | `API-Reference/src/app.cjs` |
| Sub-app mounting and the `mount` event | `API-Reference/src/app.cjs` |
| `app.path()`, `app.mountpath`, `app.router` | `API-Reference/src/app.cjs` |

## 2. 🔀 Routing — From Basics to Express 5 Specifics

| Concept | Files |
|---|---|
| Basic route methods (`get`, `post`, `put`, `delete`) | `template/routes/index.js`, `users.js` |
| `router.route()` chaining | `template/routes/index.js` (`/book`) |
| Named route parameters | `/books/:bookId`, `/users/:userId` |
| **Express 5 named wildcards** `{*name}` | `/files/{*filepath}` |
| Optional parameter segments `{:param}` | `/papers/{:paperId}` |
| Optional path segments `{/segment}` | `/rules{/:ruleId}` |
| Regular-expression routes with captures | `API-Reference` — `/api/commits/(\w+)(?:\.\.(\w+))?` |
| `next('route')` — skip remaining route handlers | `template/routes/index.js` (`/pens/:penId`), `API-Reference` |
| `next('router')` — exit the current router | `API-Reference/src/app.cjs` (`/api/flow/router`) |
| Router options: `caseSensitive`, `strict`, `mergeParams` | `API-Reference/src/app.cjs` |
| Nested routers with inherited `req.params` | `API-Reference` (`/api/parents/:parentId/nested/:id`) |
| The experimental HTTP `QUERY` method | `API-Reference`, `template/app.js` |

## 3. ⚠️ Error Handling (Every Shape)

| Error Source | Pattern | File |
|---|---|---|
| Synchronous `throw` | Auto-caught by Express 5 | `template/app.js` (`/catchErr`) |
| `async/await` | `try/catch` → `next(err)` | `template/app.js` (`/breads/:breadId`) |
| Rejected Promise (no `.catch`) | Auto-forwarded by Express 5 | `template/app.js` (`/catchErr1`) |
| Promise chain | Explicit `.catch(next)` | `template/app.js` (`/catchErr2`) |
| Node callback API | `(err, data) => next(err)` | `template/app.js` (`/callback`) |
| Timer-based async error | Manual `try/catch` inside `setTimeout` | `template/app.js` (`/callback3`) |
| Centralized 404 + 500 + test-trigger | Factory function | `template/middleware/errorHandler.js` |
| Express-generator style error view | `res.render('error', ...)` | `template/views/error.jade` |

**Key insight:** Express 5 automatically forwards errors from `async` handlers and rejected promises to `next()` — a significant change from Express 4, where this required manual wrapping. This repository's error-handling routes appear designed specifically to probe that behavior.

## 4. 🧱 Middleware Patterns

| Pattern | File |
|---|---|
| Global middleware (`app.use`) | `template/app.js` |
| Path-scoped middleware (`app.use('/users/:userId', ...)`) | `template/app.js` |
| Middleware sub-stacks (array of functions on one path) | `template/app.js` (`/index/`) |
| Middleware **factory** (function returning middleware, accepting options) | `template/mymiddleware.cjs` |
| Router-level middleware (`router.use`) | `template/routes/birds.js`, `API-Reference` |
| Request-time annotation middleware | `template/index.cjs` (`reqTime`) |

```javascript
// Middleware factory pattern
module.exports = function(options) {
  return function(req, res, next) {
    console.log('LOGGED');
    next();
  };
};
```

## 5. 🗃️ Database Integration

| Concept | File |
|---|---|
| Full CRUD with parameterized queries | `template/routes/db.js` |
| Idempotent seed data (`INSERT OR IGNORE` + `UNIQUE`) | `template/routes/db.js` |
| Promisifying a callback-based API | `template/app.js` (`util.promisify`) |
| Graceful DB connection shutdown | `template/routes/db.js`, `template/app.js` |
| In-memory "model" abstraction (`findById`) | `template/models/bread.js` |

## 6. 🧵 Concurrency & Performance

| Concept | File |
|---|---|
| Offloading CPU work to worker threads via `piscina` | `template/resizeWorker.js`, `template/app.js` |
| Response compression | `template/app.js` (`compression` middleware) |
| Deferred execution with `setImmediate` | `template/app.js` (`/search`) |
| Writing a custom concurrent HTTP load tester | `template/loadtest.mjs` |
| Measuring p50/p95 latency manually | `template/loadtest.mjs` |

## 7. 🔐 Security & Sessions

| Concept | File |
|---|---|
| `helmet` security headers | `template/app.js` |
| Disabling the `X-Powered-By` header | `template/app.js`, `API-Reference/src/app.cjs` |
| `trust proxy` configuration (all 4 modes) | `template/trustProxy.md`, `template/app.js` |
| Cookie parsing (plain and signed) | `API-Reference/src/app.cjs`, `template/index.cjs` |
| Session management with `express-session` | `template/index.cjs` |
| Open-redirect prevention (commented experiment) | `template/app.js` |

## 8. 🎨 View Engines

| Concept | File |
|---|---|
| Standard engine registration (Jade/Pug) | `template/app.js`, `pug/app.js` |
| **Writing a custom engine from scratch** via `app.engine()` | `API-Reference/src/app.cjs` (`.ref`), `template/app.js` (`.ntl`) |
| `app.render()` outside of a request/response cycle | `API-Reference/src/app.cjs` |
| `res.render()` with locals | `API-Reference/src/app.cjs`, `pug/app.js` |

## 9. 🧪 Testing & Tooling

| Concept | File |
|---|---|
| Node's **built-in test runner** (`node --test`) | `API-Reference/test/api.test.cjs` |
| Testing against an **ephemeral port** (`listen(0)`) | `API-Reference/test/api.test.cjs` |
| HTTP assertions via native `fetch()` | `API-Reference/test/api.test.cjs` |
| Verifying headers, cookies, status codes, and bodies | `API-Reference/test/api.test.cjs` |
| Testing signed cookies round-trip | `API-Reference/test/api.test.cjs` |

## 10. 🧑‍💻 TypeScript with Express 5

| Concept | File |
|---|---|
| Typed `Express`, `Request`, `Response` imports | `ExpressJS/src/app.ts` |
| `module: "nodenext"` + ESM-native TypeScript | `ExpressJS/tsconfig.json` |
| `erasableSyntaxOnly` — type-stripping-compatible TS | `ExpressJS/tsconfig.json` |
| Declaration merging to extend `Express.Request` | `template/types/express.d.ts` |

## 11. 📖 Technical Writing

| Artifact | What It Demonstrates |
|---|---|
| Bilingual (EN/VI) README and docs | `API-Reference/README.md`, `docs/*.md` |
| API-to-test coverage mapping tables | `API-Reference/README.md` |
| Conceptual comparison tables | `template/app&router.md` (app vs. Router) |
| Deep-dive reference notes | `template/trustProxy.md` |

---

# 🧰 Full Technology Stack

## Shared Across All Projects

| Technology | Version | Used In |
|---|---:|---|
| Express | `^5.3.0` | All four projects |

## API-Reference

| Package | Version | Role |
|---|---:|---|
| express | `^5.3.0` | Web framework |
| cookie-parser | `^1.4.7` | Cookie parsing (plain + signed) |

**Node engine requirement:** `>=20.19.3 <21` or `>=22.2.0` (for HTTP `QUERY` method support).

## ExpressJS (TypeScript starter)

| Package | Version | Role |
|---|---:|---|
| express | `^5.3.0` | Web framework |
| typescript | `^7.0.2` | Type checking / compilation |
| @types/express | `^5.0.6` | Express type definitions |
| @types/node | `^26.6.5` | Node.js type definitions |

**Module system:** Native ESM (`"type": "module"`), `nodenext` resolution.

## ExpressJS/template

| Package | Version | Role |
|---|---:|---|
| express | `^5.3.0` | Web framework |
| express-session | `^1.19.0` | Session management |
| cookie-parser | `~1.4.4` | Cookie parsing |
| compression | `^1.8.2` | Gzip response compression |
| helmet | `^8.3.0` | Security headers |
| http-errors | `~1.6.3` | HTTP error object creation |
| morgan | `^1.12.1` | HTTP request logging |
| jade | `^1.9.2` | View templating |
| sqlite3 | `^6.0.1` | Embedded relational database |
| piscina | `^5.3.2` | Worker thread pool |
| debug | `~2.6.9` | Debug logging |
| nodemon *(dev)* | `^1.14.10` | Auto-reload during development |

## pug

| Package | Version | Role |
|---|---:|---|
| express | `^5.3.0` | Web framework |
| pug | `^3.0.4` | View templating |
| nodemon *(dev)* | `^3.1.14` | Auto-reload during development |

---

# 📂 Repository Structure

```text
dzt711-expressjs/
│
├── README.md                        # Top-level run commands
│
├── API-Reference/                   # Fully tested Express 5 API reference
│   ├── README.md
│   ├── package.json
│   ├── docs/
│   │   ├── application.md
│   │   ├── express-object.md
│   │   ├── request.md
│   │   ├── response.md
│   │   └── router.md
│   ├── src/
│   │   ├── app.cjs
│   │   ├── server.cjs
│   │   ├── public/sample.txt
│   │   └── views/greeting.ref
│   └── test/
│       └── api.test.cjs
│
├── ExpressJS/                       # TypeScript starter
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   └── app.ts
│   │
│   └── template/                    # Production-pattern playground
│       ├── app.js
│       ├── loadtest.mjs
│       ├── mymiddleware.cjs
│       ├── resizeWorker.js
│       ├── index.cjs
│       ├── package.json
│       ├── app&router.md
│       ├── expressDBInteration.md
│       ├── routing.md
│       ├── trustProxy.md
│       ├── persons.txt
│       │
│       ├── middleware/
│       │   └── errorHandler.js
│       ├── models/
│       │   └── bread.js
│       ├── public/stylesheets/
│       │   └── style.css
│       ├── routes/
│       │   ├── birds.js
│       │   ├── db.js
│       │   ├── index.js
│       │   └── users.js
│       ├── types/
│       │   └── express.d.ts
│       └── views/
│           ├── error.jade / index.jade / layout.jade
│           └── error.ntl / index.ntl
│
└── pug/                              # Pug templating demo
    ├── app.js
    ├── package.json
    └── views/
        └── index.pug
```

---

# 🚀 Getting Started

## Prerequisites

![Node.js](https://img.shields.io/badge/Node.js-20.19.3%2B-339933?logo=nodedotjs&logoColor=white)
![npm](https://img.shields.io/badge/npm-Package_Manager-CB3837?logo=npm&logoColor=white)

```bash
node --version   # should satisfy >=20.19.3 <21 or >=22.2.0 for API-Reference
npm --version
```

## Clone the Repository

```bash
git clone https://github.com/dzt711/dzt711-expressjs.git
cd dzt711-expressjs
```

## Run: API-Reference

```bash
cd API-Reference
npm install
npm test      # run the full integration test suite
npm start     # http://localhost:3000
```

## Run: ExpressJS (TypeScript)

```bash
cd ExpressJS
npm install
npm run dev   # http://localhost:3000
```

## Run: ExpressJS/template

```bash
cd ExpressJS/template
npm install
npm start
# or with auto-reload:
npx nodemon ./bin/www
```

> See the [notes above](#-3-expressjstemplate-production-pattern-playground) regarding the missing `bin/www` entry point and the `data/` directory required by SQLite.

### Load Test the Template App

```bash
cd ExpressJS/template
node loadtest.mjs
```

```bash
# Customize the test:
N=1000 C=100 URL=http://localhost:3000 SHOW_BODY=0 node loadtest.mjs
```

## Run: Pug Demo

```bash
cd pug
npm install
npm run dev   # http://localhost:3000
```

---

# 🧭 Routing Edge Cases Reference

A quick lookup table for the Express 5 routing syntax practiced in this repository:

| Syntax | Meaning | Example |
|---|---|---|
| `:name` | Required named parameter | `/users/:userId` |
| `{:name}` | **Optional** named parameter | `/papers/{:paperId}` |
| `{*name}` | Named wildcard capturing remaining path as an array | `/files/{*filepath}` |
| `{/segment}` | Optional whole path segment | `/rules{/:ruleId}` |
| `(regex)` | Regular expression route with capture groups | `/commits/(\w+)(?:\.\.(\w+))?` |
| `next('route')` | Skip to the next handler registered for the same path | `/pens/:penId` |
| `next('router')` | Exit the current router, resume the parent | `/api/flow/router` |

---

# 🗺️ Learning Progression

```text
Phase 1 — Fundamentals
├── ✅ express() app creation
├── ✅ Basic routing (GET/POST/PUT/DELETE)
├── ✅ Static file serving
└── ✅ View engines (Pug, Jade)

Phase 2 — Middleware & Error Handling
├── ✅ Middleware factories and sub-stacks
├── ✅ Every error-propagation shape (sync, async, promise, callback)
├── ✅ Centralized error-handling modules
└── ✅ Custom view engines from scratch

Phase 3 — Express 5 API Depth
├── ✅ Full app/request/response/router API coverage
├── ✅ Named wildcards, optional segments, regex routes
├── ✅ next('route') / next('router') flow control
└── ✅ HTTP-tested via Node's built-in test runner

Phase 4 — Production Concerns
├── ✅ SQLite CRUD with parameterized queries
├── ✅ Sessions, cookies, security headers
├── ✅ trust proxy configuration
├── ✅ Worker threads for CPU-bound work
└── ✅ Custom concurrent load testing

Phase 5 — Possible Next Steps
├── ⏳ Automated tests for ExpressJS/template
├── ⏳ Migrate template/ to TypeScript
├── ⏳ Replace Jade with an actively maintained engine
├── ⏳ Add bin/www (or document app.listen() directly)
└── ⏳ Containerize for consistent environment setup
```

---

# 👨‍💻 Author

<div align="center">

### dzt711

Express.js & Node.js Backend Learning Journey

[![GitHub](https://img.shields.io/badge/GitHub-@dzt711-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dzt711)

</div>

---

# 📄 License

`ExpressJS/package.json` declares an **MIT** license for that sub-project. No license file was found for `API-Reference/`, `ExpressJS/template/`, or `pug/` in the provided structure — add `LICENSE` files to those directories if you intend them to carry the same terms.

---

<div align="center">

## 🚂 Express.js Learning Lab

### Routing • Middleware • Error Handling • Databases • Concurrency • Testing

<br/>

![Express](https://img.shields.io/badge/Express-5.3.0-000000?logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-6.0.1-003B57?logo=sqlite&logoColor=white)
![Node Test Runner](https://img.shields.io/badge/node%3A%2Ftest-Tested-43853D?logo=nodedotjs&logoColor=white)

<br/>

Developed by [@dzt711](https://github.com/dzt711)

<br/>

⭐ Four Express.js projects, one consistent framework version, a wide range of real-world patterns.

</div>
