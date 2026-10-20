# Request Object

**Nguồn / Source:** [Express 5.x API: Request](https://expressjs.com/en/5x/api/request/)

## Page map

```text
Request
├── Properties: req.app, req.baseUrl, req.body, req.cookies, req.fresh,
│   req.host, req.hostname, req.ip, req.ips, req.method, req.originalUrl,
│   req.params, req.path, req.protocol, req.query, req.res, req.route,
│   req.secure, req.signedCookies, req.stale, req.subdomains, req.xhr
└── Methods: req.accepts(), req.acceptsCharsets(), req.acceptsEncodings(),
    req.acceptsLanguages(), req.get(), req.is(), req.range()
```

## Properties

| Property | Ý nghĩa / Meaning | Lab URL |
| --- | --- | --- |
| `req.app` | App đang xử lý request. / App handling the request. | `GET /api/request/42` |
| `req.baseUrl` | Prefix đã match khi mount router. / Matched router mount prefix. | `GET /api/request/42` trả `/api`. |
| `req.body` | Body sau khi parser phù hợp chạy; mặc định có thể chưa có. / Parsed request payload; may be unset. | `POST /api/request/42`, `/api/body/*` |
| `req.cookies`, `req.signedCookies` | Cookie đã parse; signed cookie được xác minh riêng. / Parsed and verified signed cookies. | `GET /api/request/42` với header `Cookie` |
| `req.fresh`, `req.stale` | Trạng thái validator/cache so với response. / Freshness and staleness relative to response validators. | `GET` hoặc `POST /api/request/42`; POST minh họa `false`. |
| `req.host`, `req.hostname` | Host (có thể gồm port) và hostname; dùng forwarded host khi proxy được tin cậy. / Host (possibly including port) and hostname, optionally from a trusted proxy. | `GET /api/request/42`; có thể thử `Host` và `X-Forwarded-Host`. |
| `req.ip`, `req.ips` | Địa chỉ client và chuỗi proxy theo cấu hình trust proxy. / Client and proxy IP chain. | `GET /api/request/42`; forwarded headers chỉ an toàn khi proxy được cấu hình đúng. |
| `req.method` | HTTP verb. / HTTP method. | Mọi request tới `/api/request/:id`. |
| `req.originalUrl` | URL ban đầu có query; không bị mount prefix viết lại. / Original URL including query string. | `GET /api/request/42?mode=fast`. |
| `req.params` | Route parameters đã decode. / Decoded route parameters. | `/api/request/:id`; nested route ở `/api/parents/:parentId/nested/:id`. |
| `req.path` | Phần path, không gồm query. / Path without query string. | `GET /api/request/42?mode=fast`. |
| `req.protocol`, `req.secure` | `http`/`https` và cờ TLS; forwarded protocol chỉ dựa vào proxy tin cậy. / Protocol and TLS flag. | `GET /api/request/42`. |
| `req.query` | Query object được tạo bởi query parser. / Parsed query object. | `GET /api/request/42?mode=fast`. |
| `req.res` | Response liên quan request hiện tại. / Response associated with the request. | `GET /api/request/42`; lab xác nhận `req.res === res`. |
| `req.route` | Route đã match. / Matched Route object. | `GET /api/request/42`; lab trả `routePath`. |
| `req.subdomains` | Các subdomain theo `subdomain offset` của app. / Host subdomains based on app offset. | `GET /api/request/42`; thử với host tùy chỉnh. |
| `req.xhr` | `true` nếu `X-Requested-With` là `XMLHttpRequest`. / True for the conventional XMLHttpRequest header. | Gửi `X-Requested-With: XMLHttpRequest`. |

`req.body` và `req.query` do client kiểm soát; validate kiểu và giá trị trước khi dùng. Cookie parsing đến từ `cookie-parser`, không phải core Express. `trust proxy` cần khớp đúng các hop proxy; không tin `X-Forwarded-*` của nguồn bất kỳ.

Treat `req.body` and `req.query` as untrusted input. Cookie properties are supplied by `cookie-parser`. Configure proxy trust to match known hops rather than blindly trusting forwarded headers.

## Methods

| Method | Input | Hành vi / Behavior | Lab input |
| --- | --- | --- | --- |
| `req.accepts(types)` | MIME, extension, list hoặc array. | Trả match tốt nhất hoặc `false`. / Selects the best acceptable media type. | `Accept: application/json` |
| `req.acceptsCharsets(charsets)` | Charset hoặc array. | Chọn charset chấp nhận được. / Selects an accepted charset. | `Accept-Charset: utf-8` |
| `req.acceptsEncodings(encodings)` | Encoding hoặc array. | Chọn content encoding. / Selects an accepted encoding. | `Accept-Encoding: identity` |
| `req.acceptsLanguages(languages)` | Language hoặc array; bỏ trống để lấy danh sách. | Chọn ngôn ngữ được chấp nhận. / Selects an accepted language. | `Accept-Language: en` |
| `req.get(field)` | Tên HTTP header. | Đọc header không phân biệt hoa/thường; alias `req.header()`. / Reads a header case-insensitively. | `X-Demo: hello` |
| `req.is(types)` | MIME type hoặc extension. | Đối chiếu với `Content-Type`, có thể trả `null` nếu không có body hoặc `false` nếu không khớp. / Checks request content type. | `Content-Type: application/json` |
| `req.range(size, options)` | Kích thước resource; `combine` tùy chọn. | Parse Range thành mảng range hoặc mã lỗi âm. / Parses byte ranges or returns a negative parse result. | `Range: bytes=0-2`, size lab là `10`. |

## Request URLs and commands

Server mặc định ở `http://localhost:3000`:

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

curl -i -X POST http://localhost:3000/api/request/42 \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'X-Demo: hello' \
  -d '{"topic":"routing"}'

curl -i http://localhost:3000/api/parents/parent-1/nested/item-2
```

Response của endpoint đầu chứa giá trị đã đọc như `params`, `query`, `range`, `header`, `accepts`, `xhr`, `baseUrl` và host/IP. Dùng `curl -i` để kiểm tra status và response headers. Integration tests nằm trong [`../test/api.test.cjs`](../test/api.test.cjs).
