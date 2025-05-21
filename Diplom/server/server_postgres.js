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

// ✅ PostgreSQL connection
const pool = new Pool({
    connectionString: 'postgresql://postgress:vmNTiGYt4lh4LRqbigNS00KqqIsZ6Kl4@dpg-d0hjp1l6ubrc7380sui0-a.frankfurt-postgres.render.com/register_jbz7',
    ssl: { rejectUnauthorized: false }
});

// ✅ Upload folder setup
const uploadFolder = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

app.use('/uploads', express.static(uploadFolder));

// ✅ Register
app.post('/api/register', async (req, res) => {
    const { email, password, firstName, lastName, color } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (first_name, last_name, email, password, color) VALUES ($1, $2, $3, $4, $5)',
            [firstName, lastName, email, hashedPassword, color]
        );

        res.status(201).json({
            message: 'User registered successfully!',
            user: { email, firstName, lastName, color }
        });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'User already exists with this email' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ✅ Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid email or password' });

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(401).json({ message: 'Invalid email or password' });

        res.json({
            user: {
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                color: user.color,
                avatarImage: user.avatar_image,
                createdAt: user.created_at,
                is2fa_enabled: user.is2fa_enabled
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Send 2FA code to email
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'botmaker832@gmail.com',
        pass: 'lkkb kzgt jspl uqch'
    }
});

app.post('/api/send-2fa-code', async (req, res) => {
    const { email } = req.body;

    try {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await pool.query(
            'UPDATE users SET last_2fa_code = $1, last_2fa_expires = $2 WHERE email = $3',
            [code, expiresAt, email]
        );

        await transporter.sendMail({
            from: 'botmaker832@gmail.com',
            to: email,
            subject: 'Your 2FA Code',
            text: `Your verification code: ${code}`
        });

        res.json({ message: '2FA code sent to email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send 2FA code' });
    }
});



//2FA: Проверка кода
app.post('/api/verify-2fa-code', async (req, res) => {
    const { email, code } = req.body;

    try {
        const result = await pool.query(
            'SELECT last_2fa_code, last_2fa_expires FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { last_2fa_code, last_2fa_expires } = result.rows[0];

        if (code !== last_2fa_code) {
            return res.status(401).json({ message: 'Invalid code' });
        }

        const now = new Date();
        if (now > new Date(last_2fa_expires)) {
            return res.status(410).json({ message: 'Code expired' });
        }

        // ✅ Обновить last_login и очистить поля
        await pool.query(`
            UPDATE users 
            SET last_login = NOW(), last_2fa_code = NULL, last_2fa_expires = NULL 
            WHERE email = $1
        `, [email]);

        // ✅ Вернуть обновлённого пользователя
        const updatedUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const u = updatedUser.rows[0];

        res.json({
            message: '2FA verified successfully',
            user: {
                email: u.email,
                firstName: u.first_name,
                lastName: u.last_name,
                color: u.color,
                avatarImage: u.avatar_image,
                createdAt: u.created_at,
                lastLogin: u.last_login,
                is2fa_enabled: u.is2fa_enabled
            }
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during 2FA verification' });
    }
});



// ✅ Update color and avatar
app.put('/api/users/update-color', async (req, res) => {
    const { email, color, avatarImage } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET color = $1, avatar_image = $2 WHERE email = $3 RETURNING *',
            [color, avatarImage, email]
        );
        if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'Updated successfully', user: result.rows[0] });
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ message: 'Update failed' });
    }
});

// ✅ Upload avatar
app.post('/api/users/upload-avatar', upload.single('avatar'), async (req, res) => {
    const { email } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const avatarUrl = `/uploads/${file.filename}`;

    try {
        await pool.query(
            'UPDATE users SET avatar_image = $1 WHERE email = $2',
            [avatarUrl, email]
        );
        res.json({ message: 'Avatar uploaded', avatarImage: avatarUrl });
    } catch (err) {
        console.error('Avatar save error:', err);
        res.status(500).json({ message: 'Server error while saving avatar' });
    }
});

// ✅ Delete user
app.delete('/api/users/delete', async (req, res) => {
    const { email } = req.body;

    try {
        const result = await pool.query('DELETE FROM users WHERE email = $1 RETURNING *', [email]);
        if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// ✅ Обновить имя на сертификате
app.put('/api/users/certificate-name', async (req, res) => {
    const { email, certificateName } = req.body;

    try {
        const result = await pool.query(
            'UPDATE users SET certificate_name = $1 WHERE email = $2 RETURNING *',
            [certificateName, email]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json({ message: 'Имя на сертификате обновлено', user: result.rows[0] });
    } catch (err) {
        console.error('Ошибка при обновлении имени на сертификате:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});
// ✅ Check password validity for 2FA
app.post('/api/check-password', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT password FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Неверный пароль' });
        }

        res.json({ message: 'Пароль подтвержден' });
    } catch (err) {
        console.error('Ошибка при проверке пароля:', err);
        res.status(500).json({ message: 'Ошибка сервера при проверке пароля' });
    }
});

// ✅ Включить 2FA
app.post('/api/enable-2fa', async (req, res) => {
    const { email } = req.body;
    try {
        await pool.query('UPDATE users SET is2fa_enabled = true WHERE email = $1', [email]);
        res.json({ message: '2FA включена' });
    } catch (err) {
        console.error('Ошибка при включении 2FA:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// ✅ Проверить статус 2FA
app.post('/api/check-2fa-status', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await pool.query('SELECT is2fa_enabled FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.json({ is2fa_enabled: result.rows[0].is2fa_enabled });
    } catch (err) {
        console.error('Ошибка при проверке 2FA:', err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// ❗ Отключение 2FA
app.post('/api/disable-2fa', async (req, res) => {
    const { email } = req.body;
    try {
        await pool.query('UPDATE users SET is2fa_enabled = false WHERE email = $1', [email]);
        res.json({ success: true });
    } catch (err) {
        console.error('Ошибка при отключении 2FA:', err);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});


// ✅ Start server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
