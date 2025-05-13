import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Login from "./components/Login";
import Register from "./components/Register";
import ProfileMenu from "./components/ProfileMenu";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import CourseDetails from "./components/Materials";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/Settings";
import "./index.css";

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <>
      <nav className="navbar">
        <h2>
          <span
            className="logo-link"
            onClick={() => {
              if (user) window.location.href = "/courses";
            }}
            style={{ cursor: user ? "pointer" : "default" }}
          >
            AgroInnova
          </span>


        </h2>
        {user && !["/", "/register"].includes(window.location.pathname) && (
          <ProfileMenu user={user} setUser={setUser} />
        )}

      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/payment" element={<Payment user={user} setUser={setUser} />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/settings" element={<SettingsPage user={user} setUser={setUser} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
