import React from "react";

function Profile({ user }) {
  if (!user) return <p>Пожалуйста, войдите в систему.</p>;

  const paidCourses = user.paidCourses || [];

  return (
    <div>
      <h2>Профиль пользователя</h2>
      <p>Email: {user.email}</p>

      <h3>Доступные курсы</h3>
      {paidCourses.length > 0 ? (
        <ul>
          {paidCourses.map((courseId) => (
            <li key={courseId}>Курс {courseId}</li>
          ))}
        </ul>
      ) : (
        <p>У вас пока нет купленных курсов.</p>
      )}

      <h3>Сертификаты</h3>
      <p>У вас пока нет сертификатов.</p>
    </div>
  );
}

export default Profile;
