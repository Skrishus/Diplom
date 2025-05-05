const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'register',
    password: 'Era123456',
    port: 5432,
});

// Регистрация пользователя
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
            // Повторная почта
            return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
        }

        res.status(500).json({ error: 'Internal server error.' });
    }

});

// Авторизация пользователя
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
                color: user.color
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Запуск сервера
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
