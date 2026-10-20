# Express Object: `express()`

**Nguồn / Source:** [Express 5.x API: Express object](https://expressjs.com/en/5x/api/express/)

## Page map

```text
Express object
└── Methods
    ├── express.json()
    ├── express.raw()
    ├── express.Router()
    ├── express.static()
    ├── express.text()
    └── express.urlencoded()
```

## Factory

| API | Ý nghĩa / Meaning | Ví dụ trong lab / Runnable example |
| --- | --- | --- |
| `express()` | Tạo một Express application, đồng thời là request handler có thể đưa cho HTTP server. / Creates an app and an HTTP request handler. | `createApp()` trong [`../src/app.cjs`](../src/app.cjs) |

## Built-in middleware factories

Các parser chỉ xử lý request có `Content-Type` khớp `type`; sau khi parse, dữ liệu nằm trong `req.body`. Mọi giá trị từ client vẫn cần được kiểm tra trước khi sử dụng.

| API | Tùy chọn chính / Main options | URL chạy thử / Lab URL |
| --- | --- | --- |
| `express.json(options)` | `defaultCharset` (`utf-8`), `inflate` (`true`), `limit` (`100kb`), `reviver`, `strict` (`true`), `type` (`application/json`), `verify` | `POST /api/body/json` |
| `express.raw(options)` | `inflate` (`true`), `limit` (`100kb`), `type` (`application/octet-stream`), `verify` | `POST /api/body/raw`; response kiểm tra `Buffer` và byte length |
| `express.text(options)` | `defaultCharset` (`utf-8`), `inflate` (`true`), `limit` (`100kb`), `type` (`text/plain`), `verify` | `POST /api/body/text` |
| `express.urlencoded(options)` | `extended` (`false`), `inflate` (`true`), `limit` (`100kb`), `parameterLimit` (`1000`), `type`, `verify`; khi `extended:true`: `depth` (`32`), `defaultCharset`, `charsetSentinel`, `interpretNumericEntities` | `POST /api/body/urlencoded` |

`verify(req, res, buffer, encoding)` cho phép kiểm tra raw payload trước khi parser hoàn tất; ném lỗi để từ chối parse. `extended` chọn parser form đơn giản hay parser hỗ trợ object/array lồng nhau. Các body parser được cung cấp bởi Express và dựa trên `body-parser`.

`verify(req, res, buffer, encoding)` can inspect the raw payload before parsing; throwing aborts parsing. `extended` selects simple form parsing or nested object/array parsing. Express provides these parsers using `body-parser`.

### Kiểm thử parser / Test the parsers

Chạy server từ thư mục `API-Reference/`, sau đó:

```sh
curl -i -X POST http://localhost:3000/api/body/json \
  -H 'Content-Type: application/json' -d '{"topic":"router"}'
curl -i -X POST http://localhost:3000/api/body/urlencoded \
  -H 'Content-Type: application/x-www-form-urlencoded' -d 'topic=router'
curl -i -X POST http://localhost:3000/api/body/text \
  -H 'Content-Type: text/plain' --data 'plain text'
curl -i -X POST http://localhost:3000/api/body/raw \
  -H 'Content-Type: application/octet-stream' --data-binary 'bytes'
```

Tests: nhóm `express() middleware factories and static files` trong [`../test/api.test.cjs`](../test/api.test.cjs).

## Router factory

`express.Router(options)` tạo một router có thể mount như middleware. Router có thể chứa middleware, route handlers và router con.

| Option | Default | Tác dụng / Effect |
| --- | --- | --- |
| `caseSensitive` | `false` | Phân biệt chữ hoa/thường trong path. / Match path case-sensitively. |
| `mergeParams` | `false` | Giữ params từ router cha; param trùng tên ở router con thắng. / Preserve parent params; child values win on name conflicts. |
| `strict` | `false` | Phân biệt `/path` và `/path/`. / Distinguish paths with and without a trailing slash. |

Lab tạo router `/api` với `caseSensitive:true`, `mergeParams:true`, `strict:true`, và router lồng để minh họa inherited params. `/api/ALL` và `/api/all/` trả 404; `/api/parents/parent-1/nested/item-2` trả cả hai params.

The lab mounts a router at `/api` with case-sensitive matching and a nested router that preserves parent params. See the Router chapter for routing methods and flow control.

## Static middleware

`express.static(root, options)` phân phối file từ thư mục gốc; có thể mount dưới prefix và xếp nhiều static middleware để làm fallback.

| Option | Default | Ghi chú / Notes |
| --- | --- | --- |
| `dotfiles` | `ignore` | `allow`, `deny`, hoặc `ignore`. |
| `etag` | `true` | Static files luôn dùng weak ETag. |
| `extensions` | `false` | Extension fallback khi tên file thiếu phần mở rộng. |
| `fallthrough` | `true` | File/error client không tìm thấy sẽ chuyển tiếp `next()`; `false` chuyển lỗi. |
| `immutable` | `false` | Thêm directive immutable; thường đi cùng `maxAge`. |
| `index` | `index.html` | Tên index file; `false` để tắt. |
| `lastModified` | `true` | Gửi `Last-Modified`. |
| `maxAge` | `0` | Thời gian cache tối đa. |
| `redirect` | `true` | Redirect URL thư mục thiếu slash cuối. |
| `setHeaders(res, path, stat)` | none | Đồng bộ thêm response headers. |
| `acceptRanges` | `true` | Cho phép Range request. |
| `cacheControl` | `true` | Bật/tắt `Cache-Control`. |

Lab phục vụ [`sample.txt`](../src/public/sample.txt) ở `GET /assets/sample.txt`. File tĩnh chỉ được phục vụ dưới mount path này.

Lab serves the sample file at `GET /assets/sample.txt`. Keep the static root fixed; do not build it from untrusted request input.

## Source and tests

- App setup and middleware: [`../src/app.cjs`](../src/app.cjs)
- Integration tests: [`../test/api.test.cjs`](../test/api.test.cjs)
- Parent guide: [`../README.md`](../README.md)
