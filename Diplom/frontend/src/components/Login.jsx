import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [show2FA, setShow2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');



  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('Введите корректный email');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const user = data.user;

        if (user.is2fa_enabled) {
          // 🔐 Отправляем 2FA код на почту
          await fetch('http://localhost:5001/api/send-2fa-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email }),
          });

          // ⏳ Сохраняем временно email и данные
          localStorage.setItem('pending2faEmail', user.email);
          localStorage.setItem('pending2faUser', JSON.stringify(user));

          // Переход на страницу ввода кода
          navigate('/verify-code');
        } else {
          const initials =
            (user.firstName[0] || '').toUpperCase() + (user.lastName[0] || '').toUpperCase();

          const updatedUser = {
            name: initials,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            color: user.color,
            createdAt: user.createdAt,
            paidCourses: [],
            lastLogin: new Date().toISOString(),
            is2fa_enabled: user.is2fa_enabled
          };

          // Добавим avatarImage
          if (user.avatarImage) {
            updatedUser.avatarImage = user.avatarImage.startsWith('http')
              ? user.avatarImage
              : `http://localhost:5001${user.avatarImage}`;
          } else {
            updatedUser.avatarImage = null;
          }

          localStorage.setItem('user', JSON.stringify(updatedUser));
          localStorage.setItem('userFromServer', JSON.stringify(updatedUser));
          setUser(updatedUser);
          navigate('/courses');
        }
      } else {
        setError(data.message);
      }

    } catch (err) {
      setError('Ошибка подключения к серверу');
      console.error(err);
    }
  };


  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Добро пожаловать!</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}

          <div className="login-actions">
            <button type="submit" className="login-button">Войти</button>
            <span className="forgot-password">Забыли пароль?</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;