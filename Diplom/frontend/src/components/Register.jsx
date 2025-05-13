import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register({ setUser }) {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const isLengthValid = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!(isLengthValid && hasUppercase && hasDigit)) {
            return;
        }

        // ✅ Сюда добавляем массив цветов и выбираем один
        const baseColors = ["#e57373", "#81c784", "#64b5f6", "#ba68c8", "#ffd54f", "#4dd0e1", "#a1887f"];
        const randomColor = baseColors[Math.floor(Math.random() * baseColors.length)];

        try {
            const response = await fetch('http://localhost:5001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // ✅ Отправляем цвет на сервер
                body: JSON.stringify({ email, password, firstName, lastName, color: randomColor }),
            });

            const data = await response.json();

            if (response.ok) {
                const initials =
                    (firstName[0] || '').toUpperCase() + (lastName[0] || '').toUpperCase();

                const now = new Date().toISOString();

                const newUser = {
                    name: initials,
                    firstName,
                    lastName,
                    email,
                    paidCourses: [],
                    color: randomColor,
                    createdAt: now,     //  дата регистрации
                    lastLogin: now      //  первый вход
                };


                localStorage.setItem("user", JSON.stringify(newUser));
                setUser(newUser);
                navigate("/courses");
            } else {
                setError(data.error || "Ошибка регистрации");
            }
        } catch (err) {
            setError("Ошибка соединения с сервером");
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-container">
                <h2>Регистрация</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="email"
                        placeholder="Введите email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Ваше имя"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Ваша фамилия"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Придумайте пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {password && (
                        <div className="password-hint">
                            <p className={isLengthValid ? 'valid' : 'invalid'}>Минимум 8 символов</p>
                            <p className={hasUppercase ? 'valid' : 'invalid'}>Хотя бы одна заглавная буква (A–Z)</p>
                            <p className={hasDigit ? 'valid' : 'invalid'}>Хотя бы одна цифра (0–9)</p>
                        </div>
                    )}
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit">Зарегистрироваться</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
