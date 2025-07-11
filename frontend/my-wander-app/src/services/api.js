// --- src/services/api.js ---
import axios from "axios";

const API = axios.create({
  baseURL: "https://wanderlist-acsk.onrender.com", // ← your Render backend URL
});

export default API;
