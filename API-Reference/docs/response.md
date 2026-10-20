# Response Object

**Nguồn / Source:** [Express 5.x API: Response](https://expressjs.com/en/5x/api/response/)

## Page map

```text
Response
├── Properties: res.app, res.headersSent, res.locals, res.req
└── Methods: res.append(), res.attachment(), res.clearCookie(), res.cookie(),
    res.download(), res.end(), res.format(), res.get(), res.json(), res.jsonp(),
    res.links(), res.location(), res.redirect(), res.render(), res.send(),
    res.sendFile(), res.sendStatus(), res.set(), res.status(), res.type(), res.vary()
```

`res` là response của HTTP request hiện tại, mở rộng từ Node.js `http.ServerResponse`. Tên biến có thể khác; ý nghĩa đến từ tham số callback.

`res` is the current HTTP response, extended from Node.js `http.ServerResponse`. The variable name is conventional; the callback parameter determines the actual name.

## Properties

| Property | Ý nghĩa / Meaning | Lab URL |
| --- | --- | --- |
| `res.app` | Express app xử lý response. / Express app handling the response. | `GET /api/response/properties` |
| `res.headersSent` | Cho biết headers đã gửi chưa. / Whether headers have been sent. | Route ghi nhận trước khi gửi JSON. |
| `res.locals` | Dữ liệu chỉ dùng trong request hiện tại và template render. / Request-scoped view locals. | `/api/response/properties`, `/api/response/render` |
| `res.req` | Request gắn với response. / Request associated with the response. | `/api/response/properties` xác nhận nó trùng `req` hiện tại. |

Không đặt dữ liệu người dùng chưa tin cậy vào keys/values truyền cho view engine. Giữ `res.locals` theo request, còn dữ liệu dùng chung thuộc `app.locals`.

Avoid passing untrusted values as view-engine locals. Use `res.locals` per request and `app.locals` for app-wide values.

## Methods

| Method | Arguments / Alias | Hành vi / Lab URL |
| --- | --- | --- |
| `res.append(field, value)` | Header name; string, string array hoặc undefined. | Append header; `GET /api/response/headers`. `res.set()` sau đó sẽ thay giá trị đã append. |
| `res.attachment([filename])` | Filename tùy chọn. | Đặt Content-Disposition và có thể suy ra MIME; `/api/response/attachment`. |
| `res.clearCookie(name, [options])` | Cookie name và options tương thích với cookie ban đầu. | Gửi cookie hết hạn; `/api/response/clear-cookie`. Browser cần options khớp với cookie gốc. |
| `res.cookie(name, value, [options])` | Value string/object và options. | Tùy chọn dùng trong lab: `httpOnly`, `sameSite`, `signed`; `/api/response/cookie`, `/api/response/signed-cookie`. |
| `res.download(path, [filename], [options], [callback])` | File path, tên tải xuống, sendFile options, callback. | `/api/response/download`; callback tự xử lý lỗi/response. |
| `res.end([data], [encoding], [callback])` | Data, encoding, callback tùy chọn. | Kết thúc response; `/api/response/end`, `/api/response/location`. |
| `res.format(object)` | Map MIME/extension sang handler, có thể có `default`. | Content negotiation; `/api/response/format`. |
| `res.get(field)` | Tên response header. | Đọc header không phân biệt hoa/thường; `/api/response/headers`. |
| `res.json([body])` | Giá trị JSON bất kỳ. | Gửi JSON; nhiều route trong lab. |
| `res.jsonp([body])` | Giá trị JSON bất kỳ. | JSONP theo callback query; `/api/response/jsonp?callback=showResult`. |
| `res.links(object)` | Quan hệ link sang URL hoặc danh sách URL. | Tạo `Link` response header; `/api/response/links`. |
| `res.location(path)` | Path/URL. | Gán `Location` mà không tự gửi body; `/api/response/location`. |
| `res.redirect([status], path)` | Status tùy chọn và URL/path. | Redirect; `/api/response/redirect`. Validate redirect nếu URL đến từ input. |
| `res.render(view, [locals], [callback])` | View, locals và callback tùy chọn. | Render rồi gửi HTML; `/api/response/render`. Callback nghĩa là app phải tự gửi kết quả. |
| `res.send([body])` | String, Buffer, object, array, Boolean hoặc undefined. | Gửi response; `/api/response/send`. |
| `res.sendFile(path, [options], [callback])` | Absolute path (hoặc relative với `root`), options/callback. | Gửi file; `/api/response/file`. Kiểm soát path và giới hạn `root` khi có input. |
| `res.sendStatus(code)` | HTTP status code hợp lệ. | Gửi status và status message; `/api/response/status`. |
| `res.set(field, [value])` | Header/value hoặc object headers. Alias: `res.header()`. | Đặt headers; `/api/response/headers`. |
| `res.status(code)` | HTTP status code. | Chainable; `/api/response/send`, `/api/response/status`. |
| `res.type(type)` | MIME hoặc extension. Alias: `res.contentType()`. | Đặt Content-Type; `/api/response/send`. |
| `res.vary(field)` | Tên request header. | Thêm field vào `Vary`; `/api/response/headers`. |

Cookie options phổ biến gồm `domain`, `encode`, `expires`, `httpOnly`, `maxAge`, `partitioned`, `path`, `priority`, `sameSite`, `secure`, `signed`. `res.cookie()` chỉ tạo `Set-Cookie`; muốn signed cookie cần cấu hình secret cho `cookie-parser`. `res.clearCookie()` phải dùng path/domain phù hợp cookie gốc; không truyền `expires` hoặc `maxAge` khi clear.

Common cookie options include domain, encoding, expiry, HTTP-only, max-age, partitioning, path, priority, SameSite, Secure and signing. Signed cookies need a `cookie-parser` secret. Clear a cookie with matching path/domain options.

`res.download()` và `res.sendFile()` truy cập filesystem: không ghép path từ input chưa kiểm tra; dùng `root` khi cần confinement. Khi dùng callback cho download/file, callback chịu trách nhiệm chuyển tiếp hoặc kết thúc response khi có lỗi.

## Response URLs

Server mặc định ở `http://localhost:3000`:

```sh
curl -i http://localhost:3000/api/response/properties
curl -i http://localhost:3000/api/response/headers
curl -i -H 'Accept: text/plain' http://localhost:3000/api/response/format
curl -i 'http://localhost:3000/api/response/jsonp?callback=showResult'
curl -i http://localhost:3000/api/response/redirect
curl -i http://localhost:3000/api/response/download
```

Implementation: [`../src/app.cjs`](../src/app.cjs). Tests for headers, cookies, rendering, files and status codes: [`../test/api.test.cjs`](../test/api.test.cjs).
