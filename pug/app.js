const express = require('express');
const app = express();

const PORT = 3000;

// Middleware đọc JSON request body
app.use(express.json());

// Route trang chủ
app.get('/', (req, res) => {
  res.send('Hello Expresser!');
});

app.set('view engine', 'pug');
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});