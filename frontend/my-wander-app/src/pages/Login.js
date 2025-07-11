import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", { username, password });
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("username", username);
      alert("Login successful!");
      navigate("/home");
    } catch (err) {
      alert("Login failed: " + err.response.data.error);
    }
  };

  return (
    <div className="auth-container gradient-bg">
      <form onSubmit={handleLogin} className="auth-form animated-card">
        <h2 className="auth-title">Welcome Back 👋</h2>
        <p className="auth-subtitle">Login to continue exploring ✨</p>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="auth-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="auth-input"
        />

        <button type="submit" className="auth-button">Login</button>

        <p className="auth-footer">
          Don&apos;t have an account? <a href="/signup">Signup</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
