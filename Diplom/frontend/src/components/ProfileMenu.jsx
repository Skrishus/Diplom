import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./ProfileMenu.css";
import { FaUser, FaBook, FaCog, FaQuestionCircle, FaCertificate, FaSignOutAlt } from "react-icons/fa";

function ProfileMenu({ user, setUser }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    if (!user) return null;

    const initials =
        user.firstName && user.lastName
            ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
            : "U";

    // ✅ Используем сохранённый цвет без генерации
    const avatarColor = user.color || "#999";

    return (
        <div className="profile-menu" ref={menuRef}>

            <div className="avatar-wrapper" onClick={() => setOpen(!open)}>
                <div
                    className="avatar-circle"
                    style={{
                        backgroundColor: user.avatarImage ? 'transparent' : avatarColor,
                        backgroundImage: user.avatarImage ? `url(${user.avatarImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {!user.avatarImage && initials}
                </div>


            </div>

            {open && (
                <div className="dropdown">
                    <p>{user.email}</p>
                    <hr />
                    <Link to="/profile" className="colored"><FaUser /> Профиль</Link>
                    <Link to="/courses" className="colored"><FaBook /> Мои курсы</Link>
                    <Link to="/settings" className="colored"><FaCog /> Настройки</Link>
                    <Link to="/help" className="colored"><FaQuestionCircle /> Помощь</Link>
                    <Link to="/certificates" className="colored"><FaCertificate /> Сертификаты</Link>
                    <button onClick={handleLogout} className="colored"><FaSignOutAlt /> Выйти</button>
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;
