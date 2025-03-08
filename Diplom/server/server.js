const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// Оставляем подключение к MongoDB
mongoose.connect('mongodb+srv://Sanat:123456@sanat.unssqya.mongodb.net/Diplom')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// API для логина (без проверки логина и пароля)
app.post('/api/login', (req, res) => {
  const { email } = req.body;

  // Всегда успешный ответ
  res.json({ 
    user: {
      id: "123456",
      name: "Demo User",
      email: email,
      paidCourses: []
    }
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
