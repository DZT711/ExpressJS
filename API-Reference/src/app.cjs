const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('node:fs');
const path = require('node:path');

function createApp() {
  const app = express();
  const api = express.Router({ caseSensitive: true, mergeParams: true, strict: true });
  const files = path.join(__dirname, 'public');

  app.set('name', 'express-api-reference');
  app.set('reference-mode', 'v5');
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ref');
  app.enable('reference-feature');
  app.disable('x-powered-by');
  app.set('trust proxy', 'loopback');
  app.engine('ref', (filePath, options, callback) => {
    fs.readFile(filePath, 'utf8', (error, template) => {
      if (error) return callback(error);
      const rendered = template
        .replaceAll('{{name}}', String(options.name ?? 'reader'))
        .replaceAll('{{section}}', String(options.section ?? 'Express API'));
      callback(null, rendered);
    });
  });

  app.use(express.json());
  app.use(cookieParser('reference-cookie-secret'));
  app.use('/assets', express.static(files));

  app.locals.edition = 'Express 5';
  app.locals.project = 'API Reference Lab';

  app.get('/application', (req, res) => {
    res.json({
      name: app.get('name'),
      mode: app.get('reference-mode'),
      enabled: app.enabled('trust proxy'),
      featureEnabled: app.enabled('reference-feature'),
      poweredByDisabled: app.disabled('x-powered-by'),
      locals: app.locals,
      mountpath: app.mountpath,
      path: app.path(),
      hasRouter: typeof app.router.get === 'function'
    });
  });

  app.get('/application/router', (req, res) => {
    res.json({ hasGet: typeof app.router.get === 'function' });
  });

  app.get('/application/render', (req, res, next) => {
    app.render('greeting', { name: 'Ada', section: 'Application.render' }, (error, html) => {
      if (error) return next(error);
      res.type('html').send(html);
    });
  });

  app.param('userId', (req, res, next, userId) => {
    req.loadedUserId = userId;
    next();
  });

  app.get('/application/users/:userId', (req, res) => {
    res.json({ userId: req.loadedUserId });
  });

  app.all('/application/all', (req, res) => {
    res.json({ method: req.method });
  });
  app.get('/application/methods/get', (req, res) => res.json({ method: req.method }));
  app.post('/application/methods/post', (req, res) => res.json({ method: req.method }));
  app.put('/application/methods/put', (req, res) => res.json({ method: req.method }));
  app.delete('/application/methods/delete', (req, res) => res.json({ method: req.method }));
  app.query('/application/query', (req, res) => res.json({ method: req.method, body: req.body }));

  app.route('/application/items/:itemId')
    .get((req, res) => res.json({ method: 'GET', itemId: req.params.itemId }))
    .put((req, res) => res.json({ method: 'PUT', itemId: req.params.itemId, body: req.body }))
    .delete((req, res) => res.json({ method: 'DELETE', itemId: req.params.itemId }));

  const mounted = express();
  mounted.on('mount', (parent) => {
    mounted.locals.parentName = parent.get('name');
  });
  mounted.get('/status', (req, res) => {
    res.json({ mountpath: mounted.mountpath, parentName: mounted.locals.parentName });
  });
  app.use('/mounted', mounted);

  api.use((req, res, next) => {
    req.routerMiddleware = true;
    next();
  });
  const nested = express.Router({ mergeParams: true });
  nested.get('/:id', (req, res) => {
    res.json({ parentId: req.params.parentId, id: req.params.id });
  });
  api.use('/parents/:parentId/nested', nested);

  api.param('id', (req, res, next, id) => {
    req.loadedResourceId = id;
    next();
  });

  api.all('/all', (req, res) => {
    res.json({ method: req.method, routerMiddleware: req.routerMiddleware });
  });
  api.get('/methods/get', (req, res) => res.json({ method: req.method }));
  api.post('/methods/post', (req, res) => res.json({ method: req.method }));
  api.put('/methods/put', (req, res) => res.json({ method: req.method }));
  api.delete('/methods/delete', (req, res) => res.json({ method: req.method }));
  api.query('/query', (req, res) => res.json({ method: req.method, body: req.body }));

  api.get('/flow/route', (req, res, next) => next('route'), (req, res) => {
    res.json({ handler: 'should be skipped' });
  });
  api.get('/flow/route', (req, res) => res.json({ handler: 'next route' }));
  api.get('/flow/router', (req, res, next) => next('router'));
  api.get(/^\/commits\/(\w+)(?:\.\.(\w+))?$/, (req, res) => {
    res.json({ from: req.params[0], to: req.params[1] || 'HEAD' });
  });

  api.all('/request/:id', (req, res) => {
    res.set('ETag', '"request-example-v1"');
    const range = req.range(10);
    res.json({
      appName: req.app.get('name'),
      baseUrl: req.baseUrl,
      body: req.body,
      cookies: req.cookies,
      signedCookies: req.signedCookies,
      fresh: req.fresh,
      host: req.host,
      hostname: req.hostname,
      ip: req.ip,
      ips: req.ips,
      method: req.method,
      originalUrl: req.originalUrl,
      params: req.params,
      path: req.path,
      protocol: req.protocol,
      query: req.query,
      range,
      resourceId: req.loadedResourceId,
      routePath: req.route.path,
      secure: req.secure,
      subdomains: req.subdomains,
      xhr: req.xhr,
      header: req.get('x-demo'),
      is: req.is('application/json'),
      accepts: req.accepts('application/json'),
      acceptsCharset: req.acceptsCharsets('utf-8'),
      acceptsEncoding: req.acceptsEncodings('identity'),
      acceptsLanguage: req.acceptsLanguages('en'),
      hasResponse: req.res === res,
      routerMiddleware: req.routerMiddleware,
      stale: req.stale
    });
  });

  api.post('/body/urlencoded', express.urlencoded({ extended: false }), (req, res) => {
    res.json(req.body);
  });

  api.post('/body/text', express.text({ type: 'text/plain' }), (req, res) => {
    res.json({ body: req.body });
  });

  api.post('/body/raw', express.raw({ type: 'application/octet-stream' }), (req, res) => {
    res.json({ isBuffer: Buffer.isBuffer(req.body), length: req.body.length });
  });

  api.post('/body/json', (req, res) => res.json(req.body));

  api.route('/router/items/:itemId')
    .get((req, res) => res.json({ method: 'GET', itemId: req.params.itemId }))
    .put((req, res) => res.json({ method: 'PUT', itemId: req.params.itemId }))
    .delete((req, res) => res.json({ method: 'DELETE', itemId: req.params.itemId }));

  api.get('/response/properties', (req, res) => {
    res.locals.section = 'Response properties';
    res.json({
      appName: res.app.get('name'),
      headersSent: res.headersSent,
      requestMatches: res.req === req,
      locals: res.locals
    });
  });

  api.get('/response/send', (req, res) => {
    res.status(201).type('text').send('sent');
  });

  api.get('/response/headers', (req, res) => {
    res.set('X-Reference', 'express-5');
    res.append('X-Trace', ['first', 'second']);
    res.vary('Accept');
    res.json({ header: res.get('X-Reference'), appName: res.app.get('name') });
  });

  api.get('/response/format', (req, res) => {
    res.format({
      'text/plain': () => res.send('plain response'),
      'application/json': () => res.json({ format: 'json' }),
      default: () => res.status(406).send('Not Acceptable')
    });
  });

  api.get('/response/jsonp', (req, res) => res.jsonp({ message: 'jsonp response' }));
  api.get('/response/links', (req, res) => {
    res.links({ next: '/api/page/2', last: '/api/page/8' }).send('links');
  });
  api.get('/response/location', (req, res) => {
    res.location('/api/response/send').status(204).end();
  });
  api.get('/response/redirect', (req, res) => res.redirect(302, '/application'));
  api.get('/response/status', (req, res) => res.status(202).sendStatus(202));
  api.get('/response/end', (req, res) => res.status(204).end());
  api.get('/response/cookie', (req, res) => {
    res.cookie('theme', 'dark', { httpOnly: true, sameSite: 'strict' }).send('cookie set');
  });
  api.get('/response/signed-cookie', (req, res) => {
    res.cookie('access', 'read-only', { signed: true, httpOnly: true }).send('signed cookie set');
  });
  api.get('/response/clear-cookie', (req, res) => {
    res.clearCookie('theme').send('cookie cleared');
  });
  api.get('/response/attachment', (req, res) => {
    res.attachment('sample.txt').send('attachment');
  });
  api.get('/response/file', (req, res) => {
    res.sendFile(path.join(files, 'sample.txt'));
  });
  api.get('/response/download', (req, res, next) => {
    res.download(path.join(files, 'sample.txt'), 'download.txt', (error) => {
      if (error) next(error);
    });
  });
  api.get('/response/render', (req, res) => {
    res.locals.section = 'Response.render';
    res.render('greeting', { name: 'Lin' });
  });

  api.get('/errors/async', async (req, res) => {
    throw new Error('async route example');
  });

  app.use('/api', api);
  app.get('/api/flow/router', (req, res) => res.json({ handler: 'parent app' }));

  app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
  });

  app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ error: error.message });
  });

  return app;
}

module.exports = { createApp };