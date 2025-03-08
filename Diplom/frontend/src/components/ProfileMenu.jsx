import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProfileMenu.css";

function ProfileMenu({ user, setUser }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user"); // Удаляем пользователя
        setUser(null); // Обнуляем state
        navigate("/"); // Перенаправляем на главную
    };

    if (!user) return null; // Если нет пользователя, не рендерим меню

    return (
        <div className="profile-menu">
            <img
                src="https://agroinnova.kz/wp-content/uploads/2024/03/logo_new-e1711459350376.png"
                alt="Profile"
                className="profile-icon"
                onClick={() => setOpen(!open)}
            />

            {open && (
                <div className="dropdown">
                    <p><strong>{user.name || "Пользователь"}</strong></p>
                    <p>{user.email}</p>
                    <hr />
                    <Link to="/profile">👤 Мой профиль</Link>
                    <Link to="/courses">📚 Мои курсы</Link>
                    <Link to="/certificates">🎓 Сертификаты</Link>
                    <button onClick={handleLogout}>🚪 Выйти</button> {/* Исправлено */}
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;
