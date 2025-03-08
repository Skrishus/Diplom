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
          const response = await fetch('http://localhost:5000/api/login', { // Запрос на сервер
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }), 
          });
      
          const data = await response.json(); // Получаем ответ от сервера
      
          if (response.ok) {
            localStorage.setItem("user", JSON.stringify(data.user)); // Сохраняем пользователя
            setUser(data.user);
            navigate('/courses'); // Перенаправляем на курсы
          } else {
            setError(data.message); // Выводим ошибку
          }
        } catch (err) {
          setError('Ошибка подключения к серверу');
          console.error(err);
        }
      };
      
    return (
        <div className="login-container">
            <h2>Вход</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Пароль" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    minLength={6} 
                    required 
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Войти</button>
            </form>
        </div>
    );
}

export default Login;