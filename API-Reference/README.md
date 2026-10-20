# Express 5 API Reference Lab / Sổ tay Express 5 API

[English](#english) · [Tiếng Việt](#tiếng-việt) · [Official API Reference](https://expressjs.com/en/5x/api/)

This is an independent, runnable study project for the Express 5 API Reference. Examples are original, small, and tested over HTTP. The official reference remains the source of truth for full option lists and version details; this guide links to it instead of reproducing its prose.

Đây là project học tập độc lập, có thể chạy, dành cho Express 5 API Reference. Ví dụ được viết mới, ngắn gọn và kiểm thử qua HTTP. Tài liệu chính thức vẫn là nguồn chuẩn cho danh sách tùy chọn và chi tiết phiên bản; sách này dẫn link thay vì chép lại nội dung.

## English

### 1. Run the lab

Requires Node.js 20 or newer.

```sh
npm install
npm test
npm start
```

The server listens on port `3000` by default. Choose another port with `PORT=3001 npm start`. Stop it with `Ctrl+C`; the server handles `SIGINT` and `SIGTERM` and closes its listener.

```sh
curl -i http://localhost:3000/application
curl -i http://localhost:3000/api/request/42?mode=fast
curl -i -X POST http://localhost:3000/api/body/json \
  -H 'Content-Type: application/json' \
  -d '{"topic":"routing"}'
```

`npm test` uses Node's built-in test runner and an ephemeral local port. It does not require a separately running server.

### 2. Read the examples

- `src/app.cjs` builds the app and mounts the examples.
- `src/server.cjs` starts the HTTP server and demonstrates `app.listen()` and graceful shutdown.
- `src/views/greeting.ref` and `src/public/sample.txt` are fixtures for rendering, static files, downloads, and file responses.
- `test/api.test.cjs` sends real HTTP requests and checks status codes, headers, cookies, and bodies.

#### API chapters

These five chapters follow the tabs and page maps in the Express 5 API Reference. Mỗi chương liệt kê API, đối số/tùy chọn quan trọng và ví dụ hoặc URL chạy được trong lab.

1. [`express()` and middleware factories`](docs/express-object.md)
2. [Application object](docs/application.md)
3. [Request object](docs/request.md)
4. [Response object](docs/response.md)
5. [Router](docs/router.md)

### 3. API coverage map

Every named member below has a runnable example or is exercised by the test server itself. Some members share one route so the guide stays small. Open the [official reference](https://expressjs.com/en/5x/api/) for exact signatures, all options, and migration notes.

#### `express()` and exported middleware

| API | Lab example | Test |
| --- | --- | --- |
| `express()` | `createApp()` in `src/app.cjs` | Application settings test |
| `express.json()` | `POST /api/body/json` | Middleware factories test |
| `express.urlencoded()` | `POST /api/body/urlencoded` | Middleware factories test |
| `express.text()` | `POST /api/body/text` | Middleware factories test |
| `express.raw()` | `POST /api/body/raw` | Middleware factories test |
| `express.static()` | `GET /assets/sample.txt` | Middleware factories test |
| `express.Router()` | `/api`, strict/case-sensitive matching and nested router under `/api/parents/:parentId/nested` | Router test |

#### Application object

| API members | Example / verification |
| --- | --- |
| Properties: `app.locals`, `app.mountpath`, `app.router` | `GET /application`, `/application/router`, `/mounted/status` |
| Event: `app.on('mount')` | Parent app name is copied when the child app mounts; Application test |
| `app.all()` | `POST /application/all`; `GET /api/all` |
| `app.query()` | `QUERY /application/query` with JSON request body |
| `app.delete()`, `app.get()`, `app.post()`, `app.put()`, `app.METHOD()` | Direct routes at `/application/methods/{get,post,put,delete}`; chained route methods at `/application/items/:itemId` |
| `app.disable()`, `app.disabled()`, `app.enable()`, `app.enabled()` | `x-powered-by`, `trust proxy`, and `reference-feature` settings; `GET /application` |
| `app.engine()` | Registers the small `.ref` template engine |
| `app.get(name)`, `app.set()` | App settings returned by `GET /application` |
| `app.get(path, ...)`, `app.route()` | Parameter and item routes |
| `app.listen()` | `src/server.cjs`; tests listen on an ephemeral port |
| `app.param()` | `GET /application/users/:userId` |
| `app.path()` | Included in `GET /application` |
| `app.render()` | `GET /application/render` |
| `app.use()` | Global middleware and mounted routers |

#### Request object

| API members | Example / verification |
| --- | --- |
| Properties: `req.app`, `req.baseUrl`, `req.body`, `req.cookies`, `req.signedCookies`, `req.fresh`, `req.host`, `req.hostname`, `req.ip`, `req.ips`, `req.method`, `req.originalUrl`, `req.params`, `req.path`, `req.protocol`, `req.query`, `req.res`, `req.route`, `req.secure`, `req.stale`, `req.subdomains`, `req.xhr` | `GET` or `POST /api/request/:id`; test supplies headers, cookies, body, query, and range |
| `req.accepts()`, `req.acceptsCharsets()`, `req.acceptsEncodings()`, `req.acceptsLanguages()` | Content negotiation fields in `/api/request/:id` response |
| `req.get()` | `X-Demo` request header |
| `req.is()` | JSON content-type check |
| `req.range()` | `Range: bytes=0-2` request header |

#### Request API URLs

All URLs below assume the server is running at `http://localhost:3000`. Request properties and methods are read from the incoming HTTP request, so several of them share the same endpoint and differ only by method, query, headers, or body.

| HTTP method and URL | Request API demonstrated |
| --- | --- |
| `GET /api/request/42?mode=fast` | `req.app`, `req.baseUrl`, `req.hostname`, `req.ip`, `req.ips`, `req.method`, `req.originalUrl`, `req.params`, `req.path`, `req.protocol`, `req.query`, `req.route`, `req.secure`, `req.stale`, `req.subdomains`, `req.xhr`; also `req.accepts*()`, `req.get()`, `req.is()`, and `req.range()` when sent with the headers below |
| `POST /api/request/42` | `req.body`, `req.fresh`, request method and headers; send JSON with `Content-Type: application/json` |
| `GET /api/parents/parent-1/nested/item-2` | Parent and child `req.params` through a nested Router with `mergeParams` |
| `POST /api/body/json` | `req.body` parsed by `express.json()` |
| `POST /api/body/urlencoded` | `req.body` parsed by `express.urlencoded()` |
| `POST /api/body/text` | `req.body` parsed by `express.text()` |
| `POST /api/body/raw` | `req.body` parsed as a Buffer by `express.raw()` |

Example request exposing the query, route parameters, headers, cookies, and content-negotiation methods:

```sh
curl -i 'http://localhost:3000/api/request/42?mode=fast' \
  -H 'Accept: application/json' \
  -H 'Accept-Charset: utf-8' \
  -H 'Accept-Encoding: identity' \
  -H 'Accept-Language: en' \
  -H 'Range: bytes=0-2' \
  -H 'X-Demo: hello' \
  -H 'X-Requested-With: XMLHttpRequest' \
  -H 'Cookie: favorite=tea'
```

Example request for `req.body`, `req.is()`, `req.fresh`, and request method handling:

```sh
curl -i -X POST http://localhost:3000/api/request/42 \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'X-Demo: hello' \
  -d '{"topic":"routing"}'
```

Request cookie properties come from the `cookie-parser` middleware; Express does not parse cookies by itself. The `req.fresh` value is false for POST by design. Conditional GET examples should use GET or HEAD with matching validators.

#### Response object

| API members | Example / verification |
| --- | --- |
| Properties: `res.app`, `res.headersSent`, `res.locals`, `res.req` | `GET /api/response/properties` and `/api/response/render` |
| `res.append()`, `res.get()`, `res.set()`, `res.vary()` | `GET /api/response/headers` |
| `res.attachment()` | `GET /api/response/attachment` |
| `res.cookie()`, `res.clearCookie()` | `GET /api/response/cookie` and `/api/response/clear-cookie` |
| `res.download()` | `GET /api/response/download` |
| `res.end()` | `GET /api/response/end` |
| `res.format()` | `GET /api/response/format` with `Accept: text/plain` |
| `res.json()` | `POST /api/body/json` |
| `res.jsonp()` | `GET /api/response/jsonp?callback=showResult` |
| `res.links()` | `GET /api/response/links` |
| `res.location()` | `GET /api/response/location` |
| `res.redirect()` | `GET /api/response/redirect` (use `curl -i` to inspect `Location`) |
| `res.render()` | `GET /api/response/render` |
| `res.send()` | `GET /api/response/send` |
| `res.sendFile()` | `GET /api/response/file` |
| `res.sendStatus()` | `GET /api/response/status` |
| `res.status()` | Used by response examples and error handling |
| `res.type()` | `GET /api/response/send` |

#### Router object

| API members | Example / verification |
| --- | --- |
| `router.all()` | `GET /api/all` and POST in the router test |
| `router.METHOD()` | Direct method routes at `/api/methods/{get,post,put,delete}`, QUERY at `/api/query`, request/body examples, and `/api/router/items/:itemId` |
| `router.param()` | Loads the `id` parameter for `/api/request/:id` |
| `router.route()` | Chained GET/PUT/DELETE at `/api/router/items/:itemId` |
| `router.use()` | Router-wide middleware marks `routerMiddleware` in responses |
| Router options: `caseSensitive`, `mergeParams`, `strict` | `/api/ALL` and `/api/all/` return 404; nested parent/id parameter test |
| Route matching and flow control | Regex path, `next('route')`, `next('router')` | `/api/commits/abc..def`, `/api/flow/route`, `/api/flow/router` |

### 4. Example requests

```sh
curl -i http://localhost:3000/api/request/42?mode=fast
curl -i -X POST http://localhost:3000/api/body/urlencoded \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'chapter=router'
curl -i -X POST http://localhost:3000/api/body/text \
  -H 'Content-Type: text/plain' \
  --data 'plain body'
curl -i -X POST http://localhost:3000/api/body/raw \
  -H 'Content-Type: application/octet-stream' \
  --data-binary 'raw bytes'
curl -i -X PUT http://localhost:3000/api/router/items/42
curl -i http://localhost:3000/api/response/redirect
```

Expected highlights: `/api/request/42?mode=fast` returns JSON with `params.id` equal to `42` and `query.mode` equal to `fast`; the JSON body route echoes parsed JSON; the router PUT route returns its method and item ID; redirect returns `302` and a `Location` header.

## Tiếng Việt

### 1. Cài đặt và chạy

Yêu cầu Node.js 20 trở lên.

```sh
npm install
npm test
npm start
```

Mặc định server chạy ở cổng `3000`. Đổi cổng bằng `PORT=3001 npm start`. Dừng server bằng `Ctrl+C`; server xử lý `SIGINT` và `SIGTERM` để đóng listener đúng cách.

```sh
curl -i http://localhost:3000/application
curl -i 'http://localhost:3000/api/request/42?mode=fast'
curl -i -X POST http://localhost:3000/api/body/json \
  -H 'Content-Type: application/json' \
  -d '{"topic":"routing"}'
```

`npm test` dùng test runner có sẵn của Node.js và tự mở cổng local tạm thời; không cần chạy server riêng.

### 2. Cấu trúc ví dụ

- `src/app.cjs` tạo app và gắn các ví dụ.
- `src/server.cjs` khởi động HTTP server, minh họa `app.listen()` và graceful shutdown.
- `src/views/greeting.ref`, `src/public/sample.txt` là fixture cho template engine, static files, download và send file.
- `test/api.test.cjs` gửi HTTP request thật và kiểm tra status, header, cookie, body.

### 3. Cách đọc bảng API

Các member được liệt kê trong năm nhóm trên đều có ví dụ chạy được hoặc được dùng bởi test server. Một số API dùng chung route để project gọn hơn. Bảng ở phần English ánh xạ từng member sang route và test tương ứng. Xem [Express 5 API Reference chính thức](https://expressjs.com/en/5x/api/) để biết đầy đủ chữ ký hàm, tùy chọn và ghi chú phiên bản.

Lưu ý: các thuộc tính cookie trong request cần middleware `cookie-parser`; Express không tự phân tích cookie. Test kiểm tra `req.fresh` trên POST nên kết quả là `false`; khi triển khai conditional GET, hãy dùng GET/HEAD cùng validator phù hợp.

### 4. Lệnh kiểm tra ví dụ

```sh
curl -i http://localhost:3000/api/request/42?mode=fast
curl -i -X POST http://localhost:3000/api/body/urlencoded \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'chapter=router'
curl -i -X POST http://localhost:3000/api/body/text \
  -H 'Content-Type: text/plain' \
  --data 'plain body'
curl -i -X POST http://localhost:3000/api/body/raw \
  -H 'Content-Type: application/octet-stream' \
  --data-binary 'raw bytes'
curl -i -X PUT http://localhost:3000/api/router/items/42
curl -i http://localhost:3000/api/response/redirect
```

Kết quả chính: `/api/request/42?mode=fast` trả JSON có `params.id` là `42` và `query.mode` là `fast`; route JSON trả lại body đã parse; route PUT của Router trả method và item ID; redirect trả `302` cùng header `Location`.

## Coverage notes / Ghi chú phạm vi

The member map covers the Express 5 API Reference sections: `express()`, Application, Request, Response, and Router. It is a runnable learning companion, not a verbatim transcript of the official site's snippets or prose. APIs whose behavior depends on a live proxy, TLS certificate, browser policy, or deployment setup are represented with local-safe examples or documented constraints.

Bảng member bao quát các nhóm trong Express 5 API Reference: `express()`, Application, Request, Response và Router. Đây là sách học có ví dụ thực thi, không phải bản chép lại nguyên văn mã hay nội dung trên website. API phụ thuộc proxy thật, chứng chỉ TLS, chính sách trình duyệt hoặc cấu hình triển khai được minh họa bằng ví dụ local phù hợp hoặc ghi rõ giới hạn.
