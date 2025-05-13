// Profile.jsx
import './Profile.css';
import { useEffect, useState } from 'react';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    setUser(stored);
  }, []);

  if (!user) return <div className="profile-wrapper">Загрузка...</div>;

  const initials = `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase();

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div
          className="profile-avatar"
          style={{
            backgroundColor: user.avatarImage ? 'transparent' : user.color || '#888',
            backgroundImage: user.avatarImage ? `url(${user.avatarImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!user.avatarImage && `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase()}
        </div>

        <div className="profile-info">
          <h2>{user.firstName} {user.lastName}</h2>
          <p className="email">{user.email}</p>
        </div>
      </div>

      <div className="info-card">
        <h3>Профиль</h3>
        <ul>
          <li><strong>Имя:</strong> {user.firstName}</li>
          <li><strong>Фамилия:</strong> {user.lastName}</li>
          <li><strong>Email:</strong> {user.email}</li>
          <li><strong>Дата регистрации:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</li>
          <li><strong>Последний вход:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '—'}</li>

        </ul>
      </div>
    </div>
  );
}

export default Profile;