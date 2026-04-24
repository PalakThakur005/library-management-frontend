import axios from "axios";
const backenduri = import.meta.env.VITE_BACKEND_URI;

const api = axios.create({
  baseURL: backenduri,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isInvalidToken = error.response?.data?.valid === false;

    if (status === 401 || isInvalidToken) {
      
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      
      window.location.href = "/login";
    }

    return Promise.reject(error);
  })



export default api;