import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-wrapper">
      {/* Вход и Регистрация — справа сверху на уровне логотипа */}
      <div className="home-auth-floating">
        <Link to="/login" className="nav-link">Вход</Link>
        <Link to="/register" className="nav-link">Регистрация</Link>
      </div>

      <main className="home-body">
        <div className="background-overlay">
          <div className="home-hero-content">
            <h1 className="hero-title">Добро пожаловать!</h1>
            <p className="hero-subtitle">Откройте новые горизонты знаний в аграрной сфере</p>
            <div className="cta-buttons">
              <Link to="/login" className="cta-btn">Начать обучение</Link>
              <Link to="/register" className="cta-btn cta-secondary">Присоединиться</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} AgroInnova. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default Home;

