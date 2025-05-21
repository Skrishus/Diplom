import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddCourse.css';

function AddCourse() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [testQuestions, setTestQuestions] = useState([{
        question: "", options: ["", "", "", ""], correctAnswer: ""
    }]);
    const navigate = useNavigate();

    const handleSave = async () => {
        const newCourse = {
            title,
            description,
            videoUrl,
            testQuestions
        };

        try {
            const response = await fetch("http://localhost:5001/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCourse)
            });

            if (response.ok) {
                navigate("/courses");
            } else {
                alert("Ошибка при сохранении курса");
            }
        } catch (err) {
            alert("Сервер не отвечает");
            console.error(err);
        }
    };


    const handleAddQuestion = () => {
        setTestQuestions([...testQuestions, { question: "", options: ["", "", "", ""], correctAnswer: "" }]);
    };

    const handleChangeQuestion = (index, field, value) => {
        const updatedQuestions = [...testQuestions];
        updatedQuestions[index][field] = value;
        setTestQuestions(updatedQuestions);
    };

    const handleChangeOption = (index, optionIndex, value) => {
        const updatedQuestions = [...testQuestions];
        updatedQuestions[index].options[optionIndex] = value;
        setTestQuestions(updatedQuestions);
    };

    return (
        <div className="add-course-container">
            <h2>Добавить новый курс</h2>

            <div className="input-group">
                <label>Название курса:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введите название курса"
                />
            </div>

            <div className="input-group">
                <label>Описание курса:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Введите описание курса"
                />
            </div>

            <div className="input-group">
                <label>Видео URL:</label>
                <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Введите ссылку на видео"
                />
            </div>

            <div className="test-section">
                <h3>Тесты</h3>
                {testQuestions.map((question, index) => (
                    <div key={index} className="test-question">
                        <div className="input-group">
                            <label>Вопрос:</label>
                            <input
                                type="text"
                                value={question.question}
                                onChange={(e) => handleChangeQuestion(index, "question", e.target.value)}
                                placeholder="Введите вопрос"
                            />
                        </div>

                        <div className="input-group">
                            <label>Варианты:</label>
                            {question.options.map((option, optionIndex) => (
                                <input
                                    key={optionIndex}
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleChangeOption(index, optionIndex, e.target.value)}
                                    placeholder={`Вариант ${optionIndex + 1}`}
                                />
                            ))}
                        </div>

                        <div className="input-group">
                            <label>Правильный ответ:</label>
                            <input
                                type="text"
                                value={question.correctAnswer}
                                onChange={(e) => handleChangeQuestion(index, "correctAnswer", e.target.value)}
                                placeholder="Введите правильный ответ"
                            />
                        </div>
                    </div>
                ))}
                <button type="button" onClick={handleAddQuestion} className="add-question-button">
                    Добавить вопрос
                </button>
                <br />
            </div>

            <button onClick={handleSave} className="save-course-button">Сохранить курс</button>
        </div>
    );
}

export default AddCourse;