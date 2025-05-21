// src/pages/VerifyCode.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifyCode.css';

function VerifyCode({ setUser }) {


    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const email = localStorage.getItem('pending2faEmail');
    const user = JSON.parse(localStorage.getItem('pending2faUser'));

    const handleVerify = async () => {


        try {
            const res = await fetch('http://localhost:5001/api/verify-2fa-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Неверный код');
                return;
            }

            // ✅ Успешная проверка кода
            const fullUser = { ...user, ...data.user };
            localStorage.setItem('user', JSON.stringify(fullUser));
            setUser(fullUser);

            localStorage.removeItem('pending2faEmail');
            localStorage.removeItem('pending2faUser');

            navigate('/courses');
        } catch (err) {
            console.error(err);
            setError('Ошибка сервера');
        }
    };


    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2>Введите код</h2>
                <p>Код был отправлен на <b>{email}</b></p>
                <input
                    type="text"
                    placeholder="6-значный код"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                {error && <div className="eerror-message">{error}</div>}
                <button onClick={handleVerify} className="verify-button">Подтвердить</button>
            </div>
        </div>
    );
}

export default VerifyCode; 