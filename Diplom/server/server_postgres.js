const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(cors());

// ✅ Подключение к PostgreSQL
const pool = new Pool({
    connectionString: 'postgresql://postgress:vmNTiGYt4lh4LRqbigNS00KqqIsZ6Kl4@dpg-d0hjp1l6ubrc7380sui0-a.frankfurt-postgres.render.com/register_jbz7',
    ssl: { rejectUnauthorized: false }
});


// ✅ Настройка папки загрузки
const uploadFolder = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// ✅ Настройка multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// ✅ Отдача загруженных файлов
app.use('/uploads', express.static(uploadFolder));

// ✅ Регистрация пользователя
app.post('/api/register', async (req, res) => {
    const { email, password, firstName, lastName, color } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (first_name, last_name, email, password, color) VALUES ($1, $2, $3, $4, $5)',
            [firstName, lastName, email, hashedPassword, color]
        );

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error(err);

        if (err.code === '23505') {
            return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
        }

        res.status(500).json({ error: 'Internal server error.' });
    }
});

// ✅ Авторизация пользователя
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        res.json({
            user: {
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                color: user.color,
                avatarImage: user.avatar_image,
                createdAt: result.rows[0].created_at
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// ✅ Обновление цвета и base64-аватара (если используется)
app.put('/api/users/update-color', async (req, res) => {
    const { email, color, avatarImage } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET color = $1, avatar_image = $2 WHERE email = $3 RETURNING *',
            [color, avatarImage, email]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json({ message: 'Цвет обновлён', user: result.rows[0] });
    } catch (err) {
        console.error('Ошибка при обновлении цвета:', err);
        res.status(500).json({ message: 'Ошибка при обновлении цвета' });
    }
});

// ✅ Загрузка файла-аватара и сохранение ссылки в базу
app.post('/api/users/upload-avatar', upload.single('avatar'), async (req, res) => {
    const { email } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'Файл не загружен' });
    }

    const avatarUrl = `/uploads/${file.filename}`;

    try {
        const result = await pool.query(
            'UPDATE users SET avatar_image = $1 WHERE email = $2 RETURNING *',
            [avatarUrl, email]
        );

        res.json({ message: 'Фото загружено', avatarImage: avatarUrl });
    } catch (err) {
        console.error('Ошибка при сохранении ссылки на фото:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// ✅ Запуск сервера
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

