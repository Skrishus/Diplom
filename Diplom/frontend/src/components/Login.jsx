import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        const first = data.user.firstName || '';
        const last = data.user.lastName || '';
        const initials =
          (first[0] || '').toUpperCase() + (last[0] || '').toUpperCase();

        const updatedUser = {
          name: initials,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          color: data.user.color,
          createdAt: data.user.createdAt, // ✅ добавлено!
          paidCourses: [],
          lastLogin: new Date().toISOString()
        };


        // Если есть avatarImage, добавим полный путь
        if (data.user.avatarImage) {
          updatedUser.avatarImage = data.user.avatarImage.startsWith('http')
            ? data.user.avatarImage
            : `http://localhost:5001${data.user.avatarImage}`;
        } else {
          updatedUser.avatarImage = null;
        }

        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('userFromServer', JSON.stringify(updatedUser));

        setUser(updatedUser);
        navigate('/courses');
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