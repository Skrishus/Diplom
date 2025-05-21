import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Courses.css';

const allCourses = [
  {
    id: 1,
    title: 'Основы агрономии',
    description: 'Курс по базовым принципам агрономии',
  },
  {
    id: 2,
    title: 'Современные технологии в сельском хозяйстве',
    description: 'Новые подходы в агроиндустрии',
  },
  {
    id: 3,
    title: 'Экологическое земледелие',
    description: 'Принципы устойчивого сельского хозяйства',
  },
  {
    id: 4,
    title: 'Почвоведение и плодородие',
    description: 'Изучение типов почв и методов повышения урожайности',
  },
  {
    id: 5,
    title: 'Защита растений от вредителей',
    description: 'Методы биологической и химической защиты растений',
  },
  {
    id: 6,
    title: 'Агроэкология и устойчивое развитие',
    description: 'Экологические принципы в сельском хозяйстве',
  },
  {
    id: 7,
    title: 'Сельскохозяйственная техника и оборудование',
    description: 'Использование и обслуживание техники в агроиндустрии',
  },
  {
    id: 8,
    title: 'Управление агробизнесом',
    description: 'Бизнес-модели, логистика и экономика агросектора',
  },
  {
    id: 9,
    title: 'Тепличное хозяйство',
    description: 'Организация, управление и технологии тепличного выращивания',
  },
  {
    id: 10,
    title: 'Ирригация и водоснабжение в агросекторе',
    description: 'Методы орошения и рационального водопользования',
  },
  {
    id: 11,
    title: 'Селекция и семеноводство',
    description: 'Современные подходы к селекции и качеству семян',
  },
  {
    id: 12,
    title: 'Цифровое земледелие и агро-IoT',
    description: 'Инновации, сенсоры и данные в управлении сельским хозяйством',
  },
  {
    id: 13,
    title: 'Биотехнологии в сельском хозяйстве',
    description: 'Использование биотехнологий для повышения продуктивности',
  },
  {
    id: 14,
    title: 'Органическое животноводство',
    description: 'Экологичные методы содержания и кормления животных',
  },
  {
    id: 15,
    title: 'Маркетинг сельхозпродукции',
    description: 'Продвижение и сбыт продукции агросектора',
  },
  {
    id: 16,
    title: 'Фермерское дело с нуля',
    description: 'Полный курс по организации малого фермерского бизнеса',
  },
  {
    id: 17,
    title: 'Агрополитика и законодательство',
    description: 'Регулирование, субсидии и законы в аграрной сфере',
  },
  {
    id: 18,
    title: 'Пчеловодство и апипродукты',
    description: 'Уход за пчёлами и производство мёда',
  },
  {
    id: 19,
    title: 'Агроэкономика и управление рисками',
    description: 'Оценка затрат, прибыли и погодных рисков',
  },
  {
    id: 20,
    title: 'Механизация полевых работ',
    description: 'Практика и техника в посеве, сборе и обработке урожая',
  },
  {
    id: 21,
    title: 'Агрохимия и удобрения',
    description: 'Изучение состава почв и применение удобрений',
  },
  {
    id: 22,
    title: 'Зерновые культуры: технологии выращивания',
    description: 'Технологии посева, ухода и сбора зерновых',
  },
  {
    id: 23,
    title: 'Управление сельхозкооперативами',
    description: 'Организация и стратегия аграрных кооперативов',
  },
  {
    id: 24,
    title: 'Сельское развитие и экономика села',
    description: 'Инфраструктура, занятость и устойчивость сельских территорий',
  },
  {
    id: 25,
    title: 'Растениеводство в условиях засухи',
    description: 'Методы устойчивого выращивания в засушливых регионах',
  },
  {
    id: 26,
    title: 'Складская логистика агропродукции',
    description: 'Хранение, транспортировка и учёт продукции',
  },
  {
    id: 27,
    title: 'Гидропоника и аквапоника',
    description: 'Инновационные способы выращивания без почвы',
  },
  {
    id: 28,
    title: 'Животноводство: кормление и генетика',
    description: 'Современные подходы в разведении и кормлении животных',
  },
];

function Courses({ user }) {
  const [recentCourses, setRecentCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(allCourses);
  const [showRecentInitially, setShowRecentInitially] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('recentCourses');
    if (saved) {
      setRecentCourses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    handleSearch();
    if (searchTerm.trim() !== '' && showRecentInitially) {
      setShowRecentInitially(false);
    }
  }, [searchTerm]);

  const handleSearch = () => {
    const value = searchTerm.trim().toLowerCase();
    if (value === '') {
      setFilteredCourses(allCourses);
    } else {
      const filtered = allCourses.filter(course =>
        course.title.toLowerCase().includes(value) ||
        course.description.toLowerCase().includes(value)
      );
      setFilteredCourses(filtered);
    }
    setVisibleCount(20);
    setExpanded(false);
  };

  const handleMoreClick = (course) => {
    const updated = [course, ...recentCourses.filter(c => c.id !== course.id)];
    const limited = updated.slice(0, 5);
    setRecentCourses(limited);
    localStorage.setItem('recentCourses', JSON.stringify(limited));

    if (user?.paidCourses?.includes(course.id)) {
      navigate(`/courses/${course.id}`);
    } else {
      navigate('/payment', { state: { courseId: course.id } });
    }
  };

  const handleToggleCourses = () => {
    if (!expanded) {
      setVisibleCount(filteredCourses.length);
    } else {
      setVisibleCount(20);
    }
    setExpanded(!expanded);
  };

  return (
    <div className="courses-page">
      <header className="header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Поиск курсов..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch} aria-label="Поиск">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
      </header>

      {user && user.role === 'admin' && (
        <div className="add-course-button-container">
          <button className="add-course-button">
            <Link to="/admin/add-course" className="add-course-button">
              Добавить курс
            </Link>
          </button>
        </div>
      )}

      {recentCourses.length > 0 && showRecentInitially && (
        <>
          <h2 className="title">Недавно просмотренные</h2>
          <div className="course-grid">
            {recentCourses.map((course) => (
              <div className="course-card" key={course.id + '-recent'}>
                <div className="course-image" />
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <button className="details-button" onClick={() => handleMoreClick(course)}>
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="title">Доступные курсы</h2>

      {filteredCourses.length > 0 ? (
        <>
          <div className="course-grid">
            {filteredCourses.slice(0, visibleCount).map((course) => (
              <div className="course-card" key={course.id}>
                <div className="course-image" />
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <button className="details-button" onClick={() => handleMoreClick(course)}>
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length > 20 && (
            <div className="load-more-container">
              <button className="load-more-button" onClick={handleToggleCourses}>
                {expanded ? 'Показать меньше' : 'Показать больше'}
                <span className="arrow-symbol">{expanded ? '▲' : '▼'}</span>
              </button>
            </div>
          )}
        </>
      ) : (
        <p style={{ textAlign: 'center', fontWeight: 'bold' }}>По данному запросу ничего не найдено</p>
      )}
    </div>
  );
}

export default Courses;
