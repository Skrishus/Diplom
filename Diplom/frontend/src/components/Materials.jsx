import { useState } from "react";
import { Link } from "react-router-dom";

function Materials({ courseId }) {
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [testCompleted, setTestCompleted] = useState(false);

  const handleSendComment = () => {
    if (comment.trim() !== "") {
      setMessage("Ваше сообщение было успешно отправлено!");
      setComment("");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="materials-container">
      <h2>Учебные материалы</h2>

      <div className="material-section">
        <h3>Видеоурок</h3>
        <video controls className="video-field">
          <source src={`/videos/course_${courseId}.mp4`} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>

      <div className="material-section">
        <h3>Презентация</h3>
        <a href={`/presentations/course_${courseId}.pdf`} target="_blank" rel="noopener noreferrer" className="presentation-link">
          Открыть презентацию
        </a>
      </div>

      <div className="material-section">
        <h3>Текстовая лекция</h3>
        <div className="lecture-text">
          <p>
            Здесь будет текст лекции, который соответствует содержанию видеоурока.
          </p>
        </div>
      </div>

      <div className="material-section">
        <h3>Выполните задание и отправьте его на проверку</h3>
        <Link to={`/courses/${courseId}/test`} className="test-button">
          Перейти к прохождению теста
        </Link>
      </div>

      <div className="material-section">
        <h3>Оставьте комментарий или задайте вопрос преподавателю</h3>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="comment-field"
          placeholder="Введите ваш комментарий..."
        />
        <button onClick={handleSendComment} className="send-button">
          Send
        </button>
        {message && <p className="success-message">{message}</p>}
      </div>

      {testCompleted && (
        <div className="progress-container">
          <h3>Прогресс курса</h3>
          <p>Вы успешно прошли тест!</p>
        </div>
      )}
    </div>
  );
}

export default Materials;
