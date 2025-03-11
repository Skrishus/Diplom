import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Register({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }) // Отправляем данные на сервер
            });

            const data = await response.json();

            if (response.ok) {
                const newUser = { email, paidCourses: [] };
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
        <div className="login-container">
            <h2>Регистрация</h2>
            <form onSubmit={handleRegister}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Зарегистрироваться</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Register;
