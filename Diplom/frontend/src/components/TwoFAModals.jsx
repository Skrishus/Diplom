import './Security2FA.css';
import { useState, useEffect } from 'react';

function TwoFAModals({ visible, setVisible, setIs2FAEnabled }) {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.email) {
            setEmail(user.email); // авто-подставляем email
        }
    }, [visible]);


    const handleNextFromPassword = async () => {
        if (password.trim() === '') {
            setMessage({ type: 'error', text: 'Введите пароль' });
            setTimeout(() => setMessage(null), 1000);
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        const userEmail = user?.email;

        try {
            const res = await fetch('http://localhost:5001/api/check-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data.message || 'Ошибка проверки пароля' });
                setTimeout(() => setMessage(null), 1000);
                return;
            }

            setEmail(userEmail); // сохраняем email из localStorage
            setVisible('email');
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Сервер недоступен' });
        }
    };

    const handleNextFromEmail = async () => {
        try {
            const res = await fetch('http://localhost:5001/api/send-2fa-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: 'error', text: data.message || 'Ошибка отправки кода' });
                setTimeout(() => setMessage(null), 1000);
                return;
            }

            setVisible('code');



        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Ошибка сервера при отправке кода' });
        }
    };
    const handleCodeSubmit = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const emailToCheck = email || user?.email;

        try {
            const res = await fetch('http://localhost:5001/api/verify-2fa-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailToCheck, code })
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(null); // очистить предыдущую
                setTimeout(() => {
                    setMessage({ type: 'error', text: data.message || 'Ошибка кода' });
                }, 10); // небольшая задержка — заставит React перерендерить

                return;
            }

            // ✅ Теперь включаем 2FA
            await fetch('http://localhost:5001/api/enable-2fa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailToCheck })
            });
            setIs2FAEnabled(true);


            setMessage({ type: 'success', text: 'Двухфакторная аутентификация включена' });
            setVisible('none');

            // Можно также обновить локальный user
            const updated = { ...user, is2fa_enabled: true };
            localStorage.setItem('user', JSON.stringify(updated));

        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Ошибка сервера' });
        }
    };


    const renderMessage = () =>
        message && (
            <div className={`one-time-message ${message.type}`}>
                {message.text}
            </div>
        );

    return (
        <>
            {visible === 'password' && (
                <div className="modal">
                    <h3>Двухфакторная аутентификация</h3>
                    <p>Подтвердите свой пароль</p>
                    <input
                        type="password"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleNextFromPassword}>Далее</button>
                    <div className="password-error-wrapper"></div>
                    {renderMessage()}
                </div>
            )}

            {visible === 'email' && (
                <div className="modal">
                    <h3>2FA — подтверждение email</h3>
                    <p>Код будет отправлен на почту <b>{email}</b></p>
                    <button onClick={handleNextFromEmail}>Отправить код</button>
                    {renderMessage()}
                </div>
            )}

            {visible === 'code' && (
                <div className="modal">
                    <p>
                        Код отправлен на <b>{email}</b>.<br />
                        Пожалуйста, введите его ниже.
                    </p>
                    <input
                        type="text"
                        placeholder="6-значный код"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button onClick={handleCodeSubmit}>Подтвердить</button>
                    {renderMessage()}
                </div>
            )}
        </>
    );
}

export default TwoFAModals;
