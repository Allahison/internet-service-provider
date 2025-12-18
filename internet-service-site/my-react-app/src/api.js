import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

export const signupUser = (name, email, password) =>
  api.post("/auth/signup", { name, email, password });

export default api;
