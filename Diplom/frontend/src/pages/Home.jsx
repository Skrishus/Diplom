import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Добро пожаловать!</h1>
      <p>Изучайте курсы и развивайтесь!</p>
      <div className="button-group">
        <Link to="/login" className="btn">Вход</Link>
        <Link to="/register" className="btn">Регистрация</Link>
      </div>
    </div>
  );
};

export default Home;
