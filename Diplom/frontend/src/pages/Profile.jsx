import './Profile.css';

function Profile({ user }) {
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  const avatarColor = user.color || '#4a90e2';

  return (
    <div className="profile-page">
      <h2>Профиль</h2>

      {/* ✅ Обертка для центрирования аватара */}
      <div className="profile-avatar-wrapper">
        <div className="profile-avatar" style={{ backgroundColor: avatarColor }}>
          {initials}
        </div>
      </div>

      {/* Оставляем поля как есть */}
      <div className="profile-info">
        <div className="profile-field">
          <label>Имя</label>
          <input type="text" value={user.firstName || ''} readOnly />
        </div>

        <div className="profile-field">
          <label>Фамилия</label>
          <input type="text" value={user.lastName || ''} readOnly />
        </div>

        <div className="profile-field">
          <label>Электронная почта</label>
          <input type="text" value={user.email || ''} readOnly />
        </div>
      </div>

      <div className="profile-courses">
        <h3>Курсы</h3>
        <p className="no-courses">Курсы не найдены</p>
      </div>
    </div>
  );
}

export default Profile;

