const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const { createApp } = require('../src/app.cjs');

let server;
let baseUrl;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

async function request(path, options) {
  return fetch(`${baseUrl}${path}`, options);
}

test('Express 5 API examples run over HTTP', async (t) => {
  await t.test('express() middleware factories and static files', async () => {
    const json = await request('/api/body/json', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'API' })
    });
    assert.deepEqual(await json.json(), { title: 'API' });

    const form = await request('/api/body/urlencoded', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: 'chapter=router'
    });
    assert.deepEqual(await form.json(), { chapter: 'router' });

    const text = await request('/api/body/text', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: 'plain body'
    });
    assert.deepEqual(await text.json(), { body: 'plain body' });

    const raw = await request('/api/body/raw', {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream' },
      body: Buffer.from('raw bytes')
    });
    assert.deepEqual(await raw.json(), { isBuffer: true, length: 9 });

    const asset = await request('/assets/sample.txt');
    assert.equal(await asset.text(), 'Express API Reference sample asset.');
  });

  await t.test('Application settings, methods, locals, render, and mount event', async () => {
    const application = await request('/application');
    const data = await application.json();
    assert.equal(data.name, 'express-api-reference');
    assert.equal(data.mode, 'v5');
    assert.equal(data.enabled, true);
    assert.equal(data.featureEnabled, true);
    assert.equal(data.poweredByDisabled, true);
    assert.equal(data.locals.edition, 'Express 5');
    assert.equal(data.path, '');
    assert.equal(data.hasRouter, true);

    const routerProperty = await request('/application/router');
    assert.deepEqual(await routerProperty.json(), { hasGet: true });

    const user = await request('/application/users/42');
    assert.deepEqual(await user.json(), { userId: '42' });

    const all = await request('/application/all', { method: 'POST' });
    assert.deepEqual(await all.json(), { method: 'POST' });

    for (const method of ['get', 'post', 'put', 'delete']) {
      const response = await request(`/application/methods/${method}`, {
        method: method.toUpperCase()
      });
      assert.deepEqual(await response.json(), { method: method.toUpperCase() });
    }

    const item = await request('/application/items/7', { method: 'PUT' });
    assert.deepEqual(await item.json(), { method: 'PUT', itemId: '7' });

    const query = await request('/application/query', {
      method: 'QUERY',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ active: true })
    });
    assert.deepEqual(await query.json(), { method: 'QUERY', body: { active: true } });

    const mounted = await request('/mounted/status');
    assert.deepEqual(await mounted.json(), {
      mountpath: '/mounted',
      parentName: 'express-api-reference'
    });

    const rendered = await request('/application/render');
    assert.match(await rendered.text(), /Application\.render/);
  });

  await t.test('Request properties and methods', async () => {
    const response = await request('/api/request/12?mode=fast', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'accept-charset': 'utf-8',
        'accept-encoding': 'identity',
        'accept-language': 'en',
        'content-type': 'application/json',
        'cookie': 'favorite=tea',
        'range': 'bytes=0-2',
        'x-forwarded-host': 'guide.example.test',
        'x-demo': 'header-value',
        'x-requested-with': 'XMLHttpRequest'
      },
      body: JSON.stringify({ sent: true })
    });
    const data = await response.json();
    assert.equal(data.baseUrl, '/api');
    assert.equal(data.appName, 'express-api-reference');
    assert.equal(data.method, 'POST');
    assert.equal(data.fresh, false);
    assert.equal(data.originalUrl, '/api/request/12?mode=fast');
    assert.deepEqual(data.params, { id: '12' });
    assert.deepEqual(data.query, { mode: 'fast' });
    assert.deepEqual(data.body, { sent: true });
    assert.deepEqual(data.cookies, { favorite: 'tea' });
    assert.equal(data.host, 'guide.example.test');
    assert.equal(data.hostname, 'guide.example.test');
    assert.equal(data.header, 'header-value');
    assert.equal(data.is, 'application/json');
    assert.equal(data.accepts, 'application/json');
    assert.equal(data.acceptsCharset, 'utf-8');
    assert.equal(data.acceptsEncoding, 'identity');
    assert.equal(data.acceptsLanguage, 'en');
    assert.equal(data.hasResponse, true);
    assert.equal(data.resourceId, '12');
    assert.equal(data.routePath, '/request/:id');
    assert.equal(data.routerMiddleware, true);
    assert.equal(data.xhr, true);
    assert.equal(data.protocol, 'http');
    assert.equal(data.secure, false);
    assert.equal(data.stale, true);
    assert.equal(typeof data.ip, 'string');
    assert.ok(Array.isArray(data.ips));
    assert.ok(Array.isArray(data.subdomains));
    assert.deepEqual(data.range, [{ start: 0, end: 2 }]);

    const signedCookieResponse = await request('/api/response/signed-cookie');
    const signedCookie = signedCookieResponse.headers.get('set-cookie').split(';', 1)[0];
    const signedCookieRequest = await request('/api/request/12', {
      headers: { cookie: signedCookie }
    });
    assert.deepEqual((await signedCookieRequest.json()).signedCookies, { access: 'read-only' });

  });

  await t.test('Response helpers', async () => {
    const properties = await request('/api/response/properties');
    const responseProperties = await properties.json();
    assert.equal(responseProperties.appName, 'express-api-reference');
    assert.equal(responseProperties.headersSent, false);
    assert.equal(responseProperties.requestMatches, true);
    assert.equal(responseProperties.locals.section, 'Response properties');

    const sent = await request('/api/response/send');
    assert.equal(sent.status, 201);
    assert.equal(await sent.text(), 'sent');

    const headers = await request('/api/response/headers');
    assert.equal(headers.headers.get('x-reference'), 'express-5');
    assert.equal(headers.headers.get('x-trace'), 'first, second');
    assert.equal(headers.headers.get('vary'), 'Accept');
    assert.equal((await headers.json()).appName, 'express-api-reference');

    const formatted = await request('/api/response/format', {
      headers: { accept: 'text/plain' }
    });
    assert.equal(await formatted.text(), 'plain response');

    const jsonp = await request('/api/response/jsonp?callback=showResult');
    assert.match(await jsonp.text(), /typeof showResult === 'function'.*showResult\(/);

    const links = await request('/api/response/links');
    assert.match(links.headers.get('link'), /rel="next"/);

    const location = await request('/api/response/location');
    assert.equal(location.status, 204);
    assert.equal(location.headers.get('location'), '/api/response/send');

    const redirect = await request('/api/response/redirect', { redirect: 'manual' });
    assert.equal(redirect.status, 302);
    assert.equal(redirect.headers.get('location'), '/application');

    const status = await request('/api/response/status');
    assert.equal(status.status, 202);
    assert.equal(await status.text(), 'Accepted');
    assert.equal((await request('/api/response/end')).status, 204);

    const cookie = await request('/api/response/cookie');
    assert.match(cookie.headers.get('set-cookie'), /theme=dark/);
    const cleared = await request('/api/response/clear-cookie');
    assert.match(cleared.headers.get('set-cookie'), /Expires=/);

    const attachment = await request('/api/response/attachment');
    assert.match(attachment.headers.get('content-disposition'), /attachment/);
    const file = await request('/api/response/file');
    assert.match(await file.text(), /sample asset/);
    const download = await request('/api/response/download');
    assert.match(download.headers.get('content-disposition'), /download\.txt/);

    const rendered = await request('/api/response/render');
    assert.match(await rendered.text(), /Response\.render/);
  });

  await t.test('Router factory, middleware, parameters, and route methods', async () => {
    const all = await request('/api/all');
    assert.deepEqual(await all.json(), { method: 'GET', routerMiddleware: true });

    const directMethod = await request('/api/methods/post', { method: 'POST' });
    assert.deepEqual(await directMethod.json(), { method: 'POST' });

    const query = await request('/api/query', {
      method: 'QUERY',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ page: 2 })
    });
    assert.deepEqual(await query.json(), { method: 'QUERY', body: { page: 2 } });

    const nextRoute = await request('/api/flow/route');
    assert.deepEqual(await nextRoute.json(), { handler: 'next route' });
    const nextRouter = await request('/api/flow/router');
    assert.deepEqual(await nextRouter.json(), { handler: 'parent app' });

    const regexRoute = await request('/api/commits/abc..def');
    assert.deepEqual(await regexRoute.json(), { from: 'abc', to: 'def' });

    const requestExample = await request('/api/request/3');
    assert.equal(requestExample.status, 200);

    const routerRoute = await request('/api/router/items/3', { method: 'DELETE' });
    assert.deepEqual(await routerRoute.json(), { method: 'DELETE', itemId: '3' });

    const nested = await request('/api/parents/parent-1/nested/item-2');
    assert.deepEqual(await nested.json(), { parentId: 'parent-1', id: 'item-2' });

    assert.equal((await request('/api/ALL')).status, 404);
    assert.equal((await request('/api/all/')).status, 404);

    const missing = await request('/does-not-exist');
    assert.equal(missing.status, 404);

    const asyncError = await request('/api/errors/async');
    assert.equal(asyncError.status, 500);
    assert.deepEqual(await asyncError.json(), { error: 'async route example' });
  });
});