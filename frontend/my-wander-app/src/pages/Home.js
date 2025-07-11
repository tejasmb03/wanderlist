// src/pages/Home.js
import React, { useEffect, useState } from "react";
import "./Home.css";
import { FaMapMarkedAlt, FaClipboardCheck, FaBell, FaUtensils } from "react-icons/fa";

const Home = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>🌍 Welcome{username ? `, ${username}` : ""}!</h1>
        <p>Your personal travel & lifestyle planner.</p>

        <div className="home-grid">
          <div className="home-feature">
            <FaMapMarkedAlt className="home-icon" />
            <span>Explore Places</span>
          </div>
          <div className="home-feature">
            <FaUtensils className="home-icon" />
            <span>Try Restaurants</span>
          </div>
          <div className="home-feature">
            <FaClipboardCheck className="home-icon" />
            <span>Daily To-Do</span>
          </div>
          <div className="home-feature">
            <FaBell className="home-icon" />
            <span>Smart Reminders</span>
          </div>
        </div>

        <p className="home-note">✨ Select a category from the sidebar to begin!</p>
      </div>
    </div>
  );
};

export default Home;
