// src/components/Sidebar.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ children }) => {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const user_id = localStorage.getItem("user_id");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("user_id");
      localStorage.removeItem("username");
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`layout ${open ? "sidebar-open" : ""}`}>
      <FaBars onClick={() => setOpen(!open)} className="menu-icon" />

      <div className={`sidebar ${open ? "visible" : ""}`} ref={sidebarRef}>
        {/* Profile Section */}
        {username && (
          <div className="user-info">
            <div className="avatar">{username.charAt(0).toUpperCase()}</div>
            <div className="username-text">Hi, {username}</div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="sidebar-links">
          <Link to="/home" onClick={() => setOpen(false)}>🏠 HOME</Link>
          <Link to="/places" onClick={() => setOpen(false)}>📍 Places</Link>
          <Link to="/restaurants" onClick={() => setOpen(false)}>🍴 Restaurants</Link>
          <Link to="/todos" onClick={() => setOpen(false)}>✅ To-Do</Link>
          <Link to="/reminders" onClick={() => setOpen(false)}>⏰ Reminders</Link>
        </div>

        {/* Logout Button */}
        {user_id && (
          <div className="logout-container">
            <button
              onClick={() => {
                handleLogout();
                setOpen(false);
              }}
              className="logout-btn"
            >
              <FaSignOutAlt style={{ marginRight: "8px" }} />
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="content">{children}</div>
    </div>
  );
};

export default Sidebar;
