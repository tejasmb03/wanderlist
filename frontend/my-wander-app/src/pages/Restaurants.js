import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Restaurants.css";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    if (!user_id) return navigate("/login");
    loadRestaurants();
  }, [user_id, navigate]);

  const loadRestaurants = async () => {
    const res = await API.get(`/restaurants/${user_id}`);
    const sorted = res.data.sort((a, b) => a.completed - b.completed); // ✅ Sort by completion
    setRestaurants(sorted);
  };

  const addRestaurant = async () => {
    if (!newName) return;
    await API.post("/restaurants", {
      name: newName,
      user_id,
    });
    setNewName("");
    loadRestaurants();
  };

  const deleteRestaurant = async (id) => {
    await API.delete(`/restaurants/${id}`);
    loadRestaurants();
  };

  const toggleCompleted = async (id) => {
    await API.put(`/restaurants/${id}/complete`);
    loadRestaurants();
  };

  const startEdit = (id, name) => {
    setEditingId(id);
    setEditedName(name);
  };

  const saveEdit = async () => {
    if (!editedName) return;
    await API.put(`/restaurants/${editingId}`, { name: editedName });
    setEditingId(null);
    setEditedName("");
    loadRestaurants();
  };

  return (
    <div className="restaurant-container">
      <h2 className="restaurant-title">🍽️ Restaurants</h2>

      <div className="restaurant-inputs">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add a new restaurant..."
        />
        <button onClick={addRestaurant}>Add</button>
      </div>

      <ul className="restaurant-list">
        {restaurants.map((r) => (
          <li
            key={r.id}
            className={`restaurant-item ${r.completed ? "completed" : ""}`}
          >
            {editingId === r.id ? (
              <>
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
              </>
            ) : (
              <>
                <span className="restaurant-name">{r.name}</span>
                <button
                  className="complete-btn"
                  onClick={() => toggleCompleted(r.id)}
                  title="Mark as completed"
                >
                  ✅
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteRestaurant(r.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Restaurants;
