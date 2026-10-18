const express = require('express');
const app = express();

const PORT = 3000;
app.set('view engine', 'pug');
// Middleware đọc JSON request body
app.use(express.json());

// Route trang chủ
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Pug Template Example',
    message: 'Hello, Pug!'
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});