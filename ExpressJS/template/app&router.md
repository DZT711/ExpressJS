| Criterion | `app = express()` | `express.Router()` |
| :--- | :--- | :--- |
| Role | Creates the main Express application | Creates a router to group routes |
| Declaration | `const app = express()` | `const router = express.Router()` |
| Defining routes | `app.get()`, `app.post()` | `router.get()`, `router.post()` |
| Middleware | Supported | Supported |
| Starting the server | Can use `app.listen()` | Does not start a server on its own |
| Registration | Serves as the main application | Mounted onto the application using `app.use()` |