# Express.js — Database Integration Summary

**Source:** https://expressjs.com/en/guide/database-integration/

Express.js kết nối với cơ sở dữ liệu thông qua các thư viện (Node.js drivers) tương ứng. Cài đặt thư viện bằng `npm install`, sau đó khởi tạo kết nối và thực hiện truy vấn.

## Bảng tổng hợp cách kết nối các loại Database

| Database | Thư viện (Module) | Cài đặt | Cách kết nối / sử dụng |
|---|---|---|---|
| Cassandra | `cassandra-driver` | `npm install cassandra-driver` | Tạo `Client`, dùng `client.execute()` để truy vấn CQL. |
| Couchbase | `couchbase` | `npm install couchbase` | Tạo `Cluster`, mở bucket, dùng `insert()` và `query()`. |
| CouchDB | `nano` | `npm install nano` | Tạo client, chọn database bằng `nano.db.use()`, dùng `insert()` và `list()`. |
| LevelDB | `levelup` | `npm install level levelup leveldown` | Khởi tạo database bằng `levelup()`, dùng `put()` và `get()` để ghi, đọc dữ liệu. |
| MySQL | `mysql` | `npm install mysql` | Tạo kết nối bằng `mysql.createConnection()`, dùng `connect()` và `query()`. |
| MongoDB | `mongodb` | `npm install mongodb` | Dùng `MongoClient.connect()`, chọn database và collection, truy vấn bằng `find()`. |
| Neo4j | `neo4j-driver` | `npm install neo4j-driver` | Tạo driver, mở session, chạy truy vấn Cypher bằng `session.run()` hoặc transaction. |
| Oracle | `oracledb` | `npm install oracledb` | Dùng `oracledb.getConnection()`, thực thi SQL bằng `connection.execute()`, rồi đóng kết nối. |
| PostgreSQL | `pg-promise` | `npm install pg-promise` | Khởi tạo thư viện, tạo đối tượng `db`, truy vấn bằng `db.one()`, `db.any()` hoặc các phương thức phù hợp. |
| Redis | `redis` | `npm install redis` | Tạo client, kết nối đến Redis, thao tác bằng các lệnh như `set()`, `get()` và `hSet()`. |
| SQL Server | `tedious` | `npm install tedious` | Tạo `Connection`, chờ sự kiện `connect`, thực thi SQL bằng `Request` và `execSql()`. |
| SQLite | `sqlite3` | `npm install sqlite3` | Tạo database bằng `new sqlite3.Database()`, dùng `run()`, `get()`, `all()` hoặc `each()`. |
| Elasticsearch | `elasticsearch` | `npm install elasticsearch` | Tạo client, tìm kiếm dữ liệu bằng `client.search()`. |

## Quy trình kết nối chung

1. **Cài thư viện:** `npm install ten-thu-vien`.
2. **Import thư viện:** `require()` hoặc `import`.
3. **Cấu hình kết nối:** địa chỉ máy chủ, cổng, database và thông tin xác thực nếu cần.
4. **Khởi tạo kết nối/client:** tùy thuộc vào thư viện.
5. **Thực hiện truy vấn:** đọc, thêm, sửa hoặc xóa dữ liệu.
6. **Xử lý lỗi và đóng kết nối:** tùy theo cơ chế của thư viện.

## Lưu ý

- Bảng trên tổng hợp các thư viện và API theo tài liệu nguồn được cung cấp; một số ví dụ sử dụng API cũ hoặc phiên bản driver cũ.
- Khi triển khai dự án mới, cần kiểm tra phiên bản thư viện và tài liệu chính thức tương ứng.
- Không nên ghi trực tiếp mật khẩu database vào mã nguồn; nên dùng biến môi trường.
- Express.js không bắt buộc sử dụng một loại database cụ thể. Có thể chọn SQL, NoSQL hoặc cơ sở dữ liệu tìm kiếm tùy yêu cầu ứng dụng.