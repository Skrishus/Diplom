// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import SearchBar from "../components/SearchBar";

// const Courses = ({ user }) => {
//   const navigate = useNavigate();
//   const coursesList = [
//     { id: 1, title: "Основы агрономии", description: "Курс по базовым принципам агрономии" },
//     { id: 2, title: "Современные технологии в сельском хозяйстве", description: "Новые подходы в агроиндустрии" },
//     { id: 3, title: "Экологическое земледелие", description: "Принципы устойчивого сельского хозяйства" },
//   ];
//   const handleDetailsClick = (courseId) => {
//     if (!user?.paidCourses?.includes(courseId)) {
//       navigate("/payment", { state: { courseId } });
//     } else {
//       navigate(`/courses/${courseId}`);
//     }
//   };
  

// function Courses() {
//   const [filteredCourses, setFilteredCourses] = useState(coursesList);

//   const handleSearch = (query) => {
//     const filtered = coursesList.filter(course =>
//       course.title.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredCourses(filtered);
//   };

//   return (
//     <div className="container">
//       <h1>Доступные курсы</h1>
//       <SearchBar onSearch={handleSearch} />
//       <ul>
//         {filteredCourses.map((course) => (
//           <li key={course.id} className="course-card">
//             <h2>{course.title}</h2>
//             <p>{course.description}</p>
//             <Link to={`/courses/${course.id}`}><button>Подробнее</button></Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// }

// export default Courses;


import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const Courses = ({ user }) => {
  const navigate = useNavigate();

  const coursesList = [
    { id: 1, title: "Основы агрономии", description: "Курс по базовым принципам агрономии" },
    { id: 2, title: "Современные технологии в сельском хозяйстве", description: "Новые подходы в агроиндустрии" },
    { id: 3, title: "Экологическое земледелие", description: "Принципы устойчивого сельского хозяйства" },
  ];

  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    setFilteredCourses(coursesList); // Заполняем курсы при загрузке страницы
  }, []);

  console.log("Текущие курсы:", filteredCourses); // Проверяем, загружаются ли курсы

  const handleDetailsClick = (courseId) => {
    if (!user?.paidCourses?.includes(courseId)) {
      navigate("/payment", { state: { courseId } });
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  return (
    <div className="container">
      <h1>Доступные курсы</h1>
      <SearchBar onSearch={(query) => {
        const filtered = coursesList.filter(course =>
          course.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCourses(filtered);
      }} />
      
      {filteredCourses.length === 0 ? (
        <p>Нет доступных курсов</p>
      ) : (
        <ul>
          {filteredCourses.map((course) => (
            <li key={course.id} className="course-card">
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <button onClick={() => handleDetailsClick(course.id)}>Подробнее</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Courses;
