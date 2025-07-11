// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Places from "./pages/Places";
import Restaurants from "./pages/Restaurants";
import Todos from "./pages/Todos";
import Reminders from "./pages/Reminders";
import Sidebar from "./components/SideBar";

const AppRoutes = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {hideSidebar ? (
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <Sidebar>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/places" element={<Places />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="/reminders" element={<Reminders />} />
          </Routes>
        </Sidebar>
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
  