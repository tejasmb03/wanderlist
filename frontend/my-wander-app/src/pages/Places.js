import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Places.css";

const PlacesScreen = () => {
  const [places, setPlaces] = useState([]);
  const [query, setQuery] = useState("");
  const [manualPlace, setManualPlace] = useState("");
  const [results, setResults] = useState([]);
  const userId = 1;

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/places/${userId}`);
      // 🔽 Sort: uncompleted first, completed later
      const sorted = response.data.sort((a, b) => a.completed - b.completed);
      setPlaces(sorted);
    } catch (error) {
      console.error("Failed to fetch places:", error);
    }
  };

  const searchPlaces = async () => {
    try {
      const response = await axios.get(
        `https://api.locationiq.com/v1/autocomplete?key=pk.8cc65f6206a49ee17c7b1db9436c70a5&q=${query}&limit=5`
      );
      setResults(response.data);
    } catch (error) {
      console.error("LocationIQ search failed:", error);
    }
  };

  const handleAddPlace = async (name, type = "searched") => {
    if (!name) return;
    try {
      await axios.post("http://localhost:5000/places", {
        name,
        type,
        user_id: userId,
      });
      fetchPlaces();
      setQuery("");
      setResults([]);
      setManualPlace(""); // Clear manual input
    } catch (error) {
      console.error("Failed to add place:", error);
    }
  };

  const handleDeletePlace = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/places/${id}`);
      fetchPlaces();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await axios.put(`http://localhost:5000/places/${id}/complete`);
      fetchPlaces();
    } catch (error) {
      console.error("Toggle complete failed:", error);
    }
  };

  return (
    <div className="places-container">
      <h2>Places to Visit</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for places..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchPlaces}>Search</button>

        <input
          type="text"
          placeholder="Or type a place manually..."
          value={manualPlace}
          onChange={(e) => setManualPlace(e.target.value)}
        />
        <button onClick={() => handleAddPlace(manualPlace, "manual")}>
          Add Place
        </button>
      </div>

      <div className="search-results">
        {results.map((place, index) => (
          <div key={index} className="search-item">
            {place.display_name}
            <button onClick={() => handleAddPlace(place.display_name)}>
              Add
            </button>
          </div>
        ))}
      </div>

      <ul className="places-list">
        {places.map((place) => (
          <li
            key={place.id}
            className={place.completed ? "completed" : ""}
          >
            {place.name}
            <div className="place-actions">
              <button
                className="complete-btn"
                onClick={() => handleToggleComplete(place.id)}
              >
                ✅️
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeletePlace(place.id)}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlacesScreen;
