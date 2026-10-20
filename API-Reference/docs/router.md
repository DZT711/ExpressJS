# Router

**Nguồn / Source:** [Express 5.x API: Router](https://expressjs.com/en/5x/api/router/)

## Router là gì? / What is a Router?

Router là middleware có thể giữ middleware và route riêng, rồi mount vào app hoặc router khác. Có thể xem nó như một bộ định tuyến con: mount prefix được thêm ở cha, còn path trong router tính từ điểm mount.

A Router is middleware that owns route and middleware stacks and can be mounted on an app or another router. The mount prefix belongs to the parent; paths inside the router are relative to that mount.

```text
app.use('/api', router)
router.get('/items', handler)
=> GET /api/items
```

Trong lab, router chính mount tại `/api`; router con minh họa kế thừa `parentId`.

## Factory and options

`express.Router([options])` trả router mới. Lab bật cả ba options: `caseSensitive:true`, `mergeParams:true`, `strict:true`.

| Option | Default | Tác dụng / Effect | Lab |
| --- | --- | --- | --- |
| `caseSensitive` | `false` | Bật phân biệt chữ hoa/thường. / Enable case-sensitive matching. | Router chính bật `true`; `/api/ALL` không match `/api/all`. |
| `mergeParams` | `false` | Giữ params cha trong router con; tên trùng ưu tiên giá trị con. / Preserve parent params; child wins conflicts. | `/api/parents/:parentId/nested/:id`. |
| `strict` | `false` | Phân biệt slash cuối path. / Distinguish trailing slash. | Router chính bật `true`; `/api/all/` không match `/api/all`. |

## Methods

| Method | Arguments | Ý nghĩa / Lab |
| --- | --- | --- |
| `router.all(path, ...callbacks)` | `path`: string, RegExp, array; callback là function hoặc array. | Khớp mọi HTTP verb. `/api/all`; callbacks có thể `next('route')`. |
| `router.METHOD(path, ...callbacks)` | Cùng dạng path/callback; METHOD là HTTP verb viết thường. | `/api/methods/*`, `/api/query`, `/api/request/:id`, body routes và `/api/router/items/:itemId`. GET tự phục vụ HEAD nếu chưa có HEAD handler trước đó. QUERY phụ thuộc runtime. |
| `router.param(name, callback)` | `name` là string; callback `(req, res, next, value, name)`. | Nạp `id` cho `/api/request/:id`. Hook chỉ thuộc router đã khai báo, chỉ chạy cho params của router đó và tối đa một lần mỗi request/name. |
| `router.route(path)` | Một path string; trả Route để chain handlers theo verb. | `/api/router/items/:itemId` chain GET/PUT/DELETE trên cùng path. Middleware `.all()` có thể đặt trước các verb. |
| `router.use([path], ...callbacks)` | Path tùy chọn; callback là middleware, array, router hoặc app. | Middleware đầu tiên của `/api` gắn `routerMiddleware` vào request. Thứ tự gọi quyết định precedence. |

## Routing flow control

- `next()` tiếp tục middleware/route matching bình thường.
- `next('route')` bỏ qua callback còn lại của route hiện tại và thử route cùng path kế tiếp.
- `next('router')` thoát khỏi router hiện tại, trả điều khiển về middleware stack bên ngoài.
- `next(error)` chuyển đến error-handling middleware.

Lab minh họa `next('route')` tại `/api/flow/route`, `next('router')` tại `/api/flow/router`, và regex captures tại `/api/commits/abc..def`.

`next('route')` skips the remaining callbacks on the current route. `next('router')` exits the mounted router and resumes the parent app's stack.

Path của `router.all()` và `router.METHOD()` có thể là string/pattern, regular expression hoặc array; query string không tham gia so khớp path. `router.use()` nhận thêm middleware path tùy chọn. Với regex route, captures được đặt trong `req.params` theo index.

Route paths can be strings/patterns, regular expressions, or arrays. Query strings do not take part in path matching. Regex captures are exposed through indexed `req.params` values.

## URLs in this project

Server mặc định `http://localhost:3000`:

```sh
curl -i http://localhost:3000/api/all
curl -i -X POST http://localhost:3000/api/all
curl -i http://localhost:3000/api/methods/get
curl -i -X PUT http://localhost:3000/api/router/items/42
curl -i http://localhost:3000/api/parents/parent-1/nested/item-2
curl -i http://localhost:3000/api/ALL
curl -i http://localhost:3000/api/all/
```

`/api/ALL` và `/api/all/` phải trả 404 theo cấu hình `caseSensitive:true`, `strict:true`. Các ví dụ `next('route')`, `next('router')`, regex route và QUERY có route/test riêng trong lab.

See [`../src/app.cjs`](../src/app.cjs) and [`../test/api.test.cjs`](../test/api.test.cjs) for implementation and runnable tests. Parent guide: [`../README.md`](../README.md).
