import axios from "axios";

const backenduri = import.meta.env.VITE_BACKEND_URI;

const api = axios.create({
  baseURL: backenduri,
});

// 🔐 attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;