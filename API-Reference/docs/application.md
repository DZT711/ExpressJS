# Application Object

**Nguồn / Source:** [Express 5.x API: Application](https://expressjs.com/en/5x/api/application/)

## Page map

```text
Application
├── Properties: app.locals, app.mountpath, app.router
├── Event: app.on('mount')
└── Methods
    ├── app.all(), app.delete(), app.METHOD(), app.param()
    ├── app.disable(), app.disabled(), app.enable(), app.enabled()
    ├── app.engine(), app.get(setting), app.get(path, ...)
    ├── app.listen(), app.path(), app.post(), app.put(), app.query()
    ├── app.render(), app.route(), app.set(), app.use()
```

## Properties and event

| API | Tác dụng / Meaning | Ví dụ trong lab / Lab example |
| --- | --- | --- |
| `app.locals` | Giá trị tồn tại suốt vòng đời app, có thể dùng trong view. / App-wide locals available to views. | `edition` và `project` ở `GET /application` |
| `app.mountpath` | Pattern mà sub-app được mount. / Mount path pattern of a sub-app. | `GET /mounted/status` |
| `app.router` | Router nội bộ, được khởi tạo khi truy cập lần đầu. / Lazily-created router used by the app. | `GET /application/router` |
| `app.on('mount', callback)` | Event trên sub-app; callback nhận parent app. / Fires when a sub-app is mounted and receives the parent. | Parent name xuất hiện tại `/mounted/status` |

`res.locals` chỉ tồn tại trong một request; `app.locals` dùng chung trong thời gian app chạy. Không đưa dữ liệu người dùng chưa kiểm tra vào locals hoặc tên view.

## Routing and middleware methods

| API | Arguments | Tác dụng / Lab example |
| --- | --- | --- |
| `app.all(path, ...callbacks)` | Path và một hay nhiều callback. | Match mọi HTTP method tại `/application/all`. |
| `app.METHOD(path, ...callbacks)` | Path và callback; METHOD là động từ HTTP viết thường. | GET/POST/PUT/DELETE dưới `/application/methods/*`. GET cũng phục vụ HEAD nếu chưa khai báo HEAD riêng. |
| `app.query(path, ...callbacks)` | Path và callback cho HTTP QUERY. | `QUERY /application/query` đọc JSON body. Chỉ dùng runtime hỗ trợ QUERY (Node.js `>=20.19.3 <21` hoặc `>=22.2.0`). |
| `app.param(name, callback)` | Tên hoặc mảng tên param; callback `(req, res, next, value, name)`. | `/application/users/:userId` nạp param trước route. |
| `app.route(path)` | Một path; trả Route cho phép chain các method. | `/application/items/:itemId` khai báo GET/PUT/DELETE một lần. |
| `app.use([path], ...callbacks)` | Path tùy chọn và middleware/app/router. | Parser, static middleware, mounted app/router, 404 và error handler. Thứ tự khai báo là thứ tự chạy. |

`app.METHOD` có cùng dạng callback cho các HTTP verbs được hỗ trợ. `app.all` không gắn với một verb cụ thể. Callback có thể gọi `next()`, `next('route')` hoặc chuyển lỗi bằng `next(error)`. `app.query()` xử lý HTTP QUERY; body cần parser như `express.json()` trước route.

## Settings and configuration methods

| API | Arguments | Tác dụng / Lab example |
| --- | --- | --- |
| `app.set(name, value)` | Tên setting và giá trị tùy ý. | Cấu hình `name`, `views`, `view engine`, `trust proxy`. |
| `app.get(name)` | Tên setting. | Đọc `name` và `reference-mode` tại `/application`. Không nhầm với `app.get(path, callback)`. |
| `app.enable(name)` | Tên Boolean setting. | Tương đương `app.set(name, true)`. |
| `app.enabled(name)` | Tên setting. | Kiểm tra setting đang bật. |
| `app.disable(name)` | Tên Boolean setting. | Tương đương `app.set(name, false)`. |
| `app.disabled(name)` | Tên setting. | Kiểm tra setting đang tắt. |
| `app.engine(ext, callback)` | Extension và callback `(path, options, callback)`. | Đăng ký renderer `.ref` tại `src/app.cjs`. |

Lab gọi `app.enable('reference-feature')` để minh họa setting Boolean tùy chỉnh; `app.disable('x-powered-by')`, `app.enabled()` và `app.disabled()` kiểm tra trạng thái.

Các setting chuẩn gồm: `case sensitive routing`, `env`, `etag`, `jsonp callback name`, `json escape`, `json replacer`, `json spaces`, `query parser`, `strict routing`, `subdomain offset`, `trust proxy`, `views`, `view cache`, `view engine`. Tùy chọn `trust proxy` có thể là Boolean, số hop, địa chỉ/subnet, danh sách hoặc hàm. Chỉ tin các proxy đúng với topology triển khai; forwarded headers có thể bị giả mạo nếu cấu hình sai.

Common settings include routing case sensitivity, environment, ETag, JSON behavior, query parser, subdomain offset, proxy trust, views and view caching. Match proxy trust to the actual deployment topology.

## Rendering, path and server

| API | Arguments | Tác dụng / Lab example |
| --- | --- | --- |
| `app.render(view, [locals], callback)` | View, locals tùy chọn, callback nhận `(error, html)`. | `GET /application/render`; callback tự gửi HTML. |
| `app.path()` | Không có. | Trả canonical mount path; root app trả chuỗi rỗng tại `GET /application`. Với mounted apps phức tạp, thường nên dùng `req.baseUrl`. |
| `app.listen([port[, host[, backlog]]][, callback])` | Các dạng tương thích `http.Server.listen`, gồm port `0` hoặc Unix socket. | `src/server.cjs`; test bind port `0` để OS chọn cổng trống. Trả `http.Server`. |

## Ví dụ chạy được

```sh
curl -i http://localhost:3000/application
curl -i http://localhost:3000/application/router
curl -i http://localhost:3000/application/items/7
curl -i -X PUT http://localhost:3000/application/items/7
curl -i -X QUERY http://localhost:3000/application/query \
  -H 'Content-Type: application/json' -d '{"filter":{"active":true}}'
```

Route QUERY cần runtime hỗ trợ như ghi ở trên. Xem [`src/app.cjs`](../src/app.cjs), [`src/server.cjs`](../src/server.cjs) và nhóm Application trong [`test/api.test.cjs`](../test/api.test.cjs).
