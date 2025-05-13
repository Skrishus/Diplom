import './Settings.css';
import { useState, useEffect } from 'react';
import { FaPen } from 'react-icons/fa';

function Settings({ setUser }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [color, setColor] = useState('#cccccc');
    const [avatarImage, setAvatarImage] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setColor(userData.color || '#cccccc');
            setAvatarImage(userData.avatarImage || null);
        } else {
            const fallback = JSON.parse(localStorage.getItem('userFromServer'));
            if (fallback) {
                setFirstName(fallback.firstName || '');
                setLastName(fallback.lastName || '');
                setColor(fallback.color || '#cccccc');
            }
        }
    }, []);

    const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

    const handleColorSelect = (selectedColor) => {
        setColor(selectedColor);
        setAvatarImage(null);

        const userData = JSON.parse(localStorage.getItem('user'));
        const updatedUser = {
            ...userData,
            color: selectedColor,
            avatarImage: null
        };

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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: updatedUser.email,
                color: updatedUser.color
            })
        });

        if (setUser) setUser(updatedUser);

        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 1500);
    };

    return (
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
                            <button
                                className="delete-photo-btn"
                                onClick={() => {
                                    setAvatarImage(null);
                                    const userData = JSON.parse(localStorage.getItem('user'));
                                    const updatedUser = { ...userData, avatarImage: null };
                                    localStorage.setItem('user', JSON.stringify(updatedUser));
                                    if (setUser) setUser(updatedUser);
                                }}
                            >
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
                <div className="field">
                    <label>Имя</label>
                    <div className="input-with-icon">
                        <input value={firstName} onChange={e => setFirstName(e.target.value)} disabled={!isEditingName} />
                        <span className="edit-icon" onClick={() => setIsEditingName(true)}><FaPen /></span>
                    </div>
                </div>
                <div className="field">
                    <label>Фамилия</label>
                    <div className="input-with-icon">
                        <input value={lastName} onChange={e => setLastName(e.target.value)} disabled={!isEditingName} />
                        <span className="edit-icon" onClick={() => setIsEditingName(true)}><FaPen /></span>
                    </div>
                </div>
                <button className="save-btn" onClick={handleSave}>Сохранить</button>
                {successMessage && <div className="success-message">Успешно сохранено</div>}
            </div>

            <div className="certificate-name">
                <h3>Имя на сертификате</h3>
                <p>Ваше имя, <b>{firstName} {lastName}</b>. Это имя будет указано на ваших сертификатах</p>
                <button className="request-btn">запрос на изменение</button>
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
                    <p>Если вы удалите аккаунт, все данные, включая курсы и настройки, будут утеряны. Восстановление невозможно.</p>
                    <div className="popup-actions">
                        <button className="cancel-button" onClick={() => setShowDeletePopup(false)}>Отменить</button>
                        <button className="confirm-delete" onClick={() => alert('Аккаунт удалён')}>Удалить</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;