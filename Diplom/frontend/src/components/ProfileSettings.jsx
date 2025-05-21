import './ProfileSettings.css';

import { useState, useEffect, useRef } from 'react';
import { FaPen } from 'react-icons/fa';

function ProfileSettings({ setUser }) {
    const [showNamePopup, setShowNamePopup] = useState(false);
    const [middleName, setMiddleName] = useState('');
    const [nameChangeSuccess, setNameChangeSuccess] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [color, setColor] = useState('#cccccc');
    const [avatarImage, setAvatarImage] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingLastName, setIsEditingLastName] = useState(false);
    const [certFirstName, setCertFirstName] = useState('');
    const [certLastName, setCertLastName] = useState('');

    const nameInputRef = useRef(null);
    const lastNameInputRef = useRef(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setColor(userData.color || '#cccccc');
            setAvatarImage(userData.avatarImage || null);
            setCertFirstName(userData.certFirstName || '');
            setCertLastName(userData.certLastName || '');
            setMiddleName(userData.middleName || '');
        } else {
            const fallback = JSON.parse(localStorage.getItem('userFromServer'));
            if (fallback) {
                setFirstName(fallback.firstName || '');
                setLastName(fallback.lastName || '');
                setColor(fallback.color || '#cccccc');
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (nameInputRef.current && !nameInputRef.current.contains(e.target)) {
                setIsEditingName(false);
            }
            if (lastNameInputRef.current && !lastNameInputRef.current.contains(e.target)) {
                setIsEditingLastName(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

    const handleColorSelect = (selectedColor) => {
        setColor(selectedColor);
        setAvatarImage(null);
        const userData = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...userData, color: selectedColor, avatarImage: null };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser && setUser(updatedUser);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const userData = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('email', userData.email);

        try {
            const res = await fetch('http://localhost:5001/api/users/upload-avatar', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                const updatedUser = {
                    ...userData,
                    avatarImage: `http://localhost:5001${data.avatarImage}`
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser && setUser(updatedUser);
                setAvatarImage(updatedUser.avatarImage);
                setSuccessMessage(true);
                setTimeout(() => setSuccessMessage(false), 2000);
            } else {
                console.error('Ошибка при загрузке фото');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    };

    const handleSave = async () => {
        const existingUser = JSON.parse(localStorage.getItem('user')) || {};
        const updatedUser = {
            ...existingUser,
            firstName,
            lastName,
            color,
            avatarImage
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('userFromServer', JSON.stringify(updatedUser));

        await fetch('http://localhost:5001/api/users/update-color', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: updatedUser.email, color: updatedUser.color })
        });

        if (setUser) setUser(updatedUser);
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 1500);
        setIsEditingName(false);
        setIsEditingLastName(false);
    };

    const handleDeleteAccount = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));

        try {
            const res = await fetch('http://localhost:5001/api/users/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userData.email })
            });

            if (res.ok) {
                localStorage.clear();
                alert('Аккаунт удалён');
                window.location.href = '/';
            } else {
                const data = await res.json();
                alert('Ошибка: ' + data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Произошла ошибка при удалении');
        }
    };

    return (
        // вставь сюда весь JSX, который у тебя уже есть
        // он у тебя корректный и завершённый
        // начинается с <div className="settings-container">...</div>
        // и заканчивается export default ProfileSettings;
        <div className="settings-container">
            <div className="avatar-section">
                <div
                    className="avatar"
                    style={{
                        backgroundColor: avatarImage ? 'transparent' : color,
                        backgroundImage: avatarImage ? `url(${avatarImage})` : 'none',
                        backgroundSize: 'cover',
                    }}
                >
                    {!avatarImage && initials}
                </div>
                <span className="edit-icon" onClick={() => setShowColorPicker(!showColorPicker)}>
                    <FaPen />
                </span>

                {showColorPicker && (
                    <div className="avatar-settings-panel">
                        <div className="avatar-buttons">
                            <label className="upload-btn">
                                загрузить фото
                                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                            </label>
                            <button className="delete-photo-btn" onClick={() => {
                                setAvatarImage(null);
                                const userData = JSON.parse(localStorage.getItem('user'));
                                const updatedUser = { ...userData, avatarImage: null };
                                localStorage.setItem('user', JSON.stringify(updatedUser));
                                if (setUser) setUser(updatedUser);
                            }}>
                                удалить фото
                            </button>
                        </div>

                        <div className="color-grid">
                            {['#f44336', '#e91e63', '#3f51b5', '#4caf50', '#00e5ff', '#6a1b9a', '#795548', '#ffeb3b', '#ff9800'].map((clr) => (
                                <div
                                    key={clr}
                                    className="color-circle"
                                    style={{ backgroundColor: clr }}
                                    onClick={() => handleColorSelect(clr)}
                                >
                                    {clr === color && <span className="checkmark">✓</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="name-fields">
                <div className="field" ref={nameInputRef}>
                    <label>Имя</label>
                    <div className="input-with-icon">
                        <input
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            disabled={!isEditingName}
                        />
                        <span className="edit-icon" onClick={() => {
                            setIsEditingName(true);
                            setIsEditingLastName(false);
                        }}>
                            <FaPen />
                        </span>
                    </div>
                </div>

                <div className="field" ref={lastNameInputRef}>
                    <label>Фамилия</label>
                    <div className="input-with-icon">
                        <input
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            disabled={!isEditingLastName}
                        />
                        <span className="edit-icon" onClick={() => {
                            setIsEditingLastName(true);
                            setIsEditingName(false);
                        }}>
                            <FaPen />
                        </span>
                    </div>
                </div>

                <button className="save-btn" onClick={handleSave}>Сохранить</button>
                {successMessage && <div className="profile-success-message"><b>Успешно сохранено</b></div>}
            </div>

            <div className="certificate-name">
                <h3>Имя на сертификате</h3>
                <p>
                    Ваше имя, <b>{certFirstName || firstName} {certLastName || lastName}</b>. Это имя будет указано на ваших сертификатах
                </p>
                <button className="request-btn" onClick={() => setShowNamePopup(true)}>
                    запрос на изменение
                </button>
            </div>

            <div className="password-section">
                <h3>Изменить пароль</h3>
                <div className="password-inputs">
                    <input placeholder="текущий пароль" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                    <input placeholder="новый пароль" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    <input placeholder="повторите новый пароль" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} />
                </div>
                <button className="change-btn">изменить пароль</button>
            </div>

            <button className="delete-btn" onClick={() => setShowDeletePopup(true)}>Удалить аккаунт</button>

            {showDeletePopup && (
                <div className="delete-popup">
                    <h3>Удалить аккаунт?</h3>
                    <p>
                        <b>Это приведет к безвозвратному удалению всех данных аккаунта.</b> Чтобы сохранить информацию, перед удалением сделайте резервную копию.
                    </p>
                    <div className="popup-actions">
                        <button className="cancel-button" onClick={() => setShowDeletePopup(false)}>Отменить</button>
                        <button className="confirm-delete" onClick={handleDeleteAccount}>Удалить аккаунт</button>
                    </div>
                </div>
            )}

            {showNamePopup && (
                <div className="name-popup">
                    <h3>Введите свое настоящее имя</h3>
                    <p>Это имя будет указано в ваших сертификатах.</p>
                    <div className="popup-actions" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                        <input
                            placeholder="Имя"
                            value={certFirstName}
                            onChange={(e) => setCertFirstName(e.target.value)}
                            required
                        />
                        <input
                            placeholder="Фамилия"
                            value={certLastName}
                            onChange={(e) => setCertLastName(e.target.value)}
                            required
                        />
                        <input
                            placeholder="Отчество (необязательно)"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button className="cancel-button" onClick={() => setShowNamePopup(false)}>Отменить</button>
                            <button className="confirm-certificate" onClick={async () => {
                                if (!certFirstName.trim() || !certLastName.trim()) return alert('Имя и фамилия обязательны');

                                const userData = JSON.parse(localStorage.getItem('user'));
                                const fullCertificateName = `${certFirstName} ${middleName} ${certLastName}`.trim();

                                try {
                                    await fetch('http://localhost:5001/api/users/certificate-name', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            email: userData.email,
                                            certificateName: fullCertificateName
                                        })
                                    });

                                    const updatedUser = {
                                        ...userData,
                                        certFirstName,
                                        certLastName,
                                        middleName
                                    };
                                    localStorage.setItem('user', JSON.stringify(updatedUser));

                                    setShowNamePopup(false);
                                    setNameChangeSuccess(true);
                                    setTimeout(() => setNameChangeSuccess(false), 1000);
                                } catch (err) {
                                    console.error('Ошибка при сохранении имени на сертификат:', err);
                                    alert('Ошибка при сохранении имени');
                                }
                            }}>запрос на изменение</button>
                        </div>
                    </div>
                </div>
            )}

            {nameChangeSuccess && (
                <div className="success-edited" ><b>Успешно изменено</b></div>
            )}
        </div>
    );
}



export default ProfileSettings;
