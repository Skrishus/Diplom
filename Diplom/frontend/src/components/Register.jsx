import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Register({setUser}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        const newUser = { email, paidCourses: [] };
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        navigate("/courses");
    };

    return (
        <div className="login-container">
            <h2>Регистрация</h2>
            <form onSubmit={handleRegister}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
}

export default Register;