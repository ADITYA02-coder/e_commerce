import axios from "axios";
import { API_URL } from "../config/api";

const AUTH_API_URL = `${API_URL}/auth/`;

const register = (username, email, password, role = "customer") => {
  return axios.post(AUTH_API_URL + "signup", {
    username,
    email,
    password,
    role,
  });
};

const login = (username, password) => {
  return axios
    .post(AUTH_API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const getCurrentUser = () => {
  return axios.get(AUTH_API_URL + "me", {
    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user"))?.accessToken || ""}` },
  }).then((response) => {
    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  });
};

const updateProfile = (payload) => {
  return axios.put(AUTH_API_URL + "profile", payload, {
    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user"))?.accessToken || ""}` },
  }).then((response) => {
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  logout,
};

export default authService;
