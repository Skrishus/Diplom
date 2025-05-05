const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 5001;

app.use(express.json());
app.use(cors());

// 📦 Подключение к MongoDB
mongoose.connect('mongodb+srv://Sanat:123456@sanat.unssqya.mongodb.net/Diplom', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// 📄 Модель пользователя
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  color: String
});

const User = mongoose.model('User', UserSchema);

// 🔐 Регистрация
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const color = '#4a90e2'; // можно сделать рандомно или настраиваемо

    const user = await User.create({ firstName, lastName, email, password: hashedPassword, color });

    res.json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        color: user.color
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

// 🔓 Логин
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Пользователь не найден' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Неверный пароль' });

    res.json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        color: user.color
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка входа' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));

