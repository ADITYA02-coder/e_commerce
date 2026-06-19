import axios from "axios";
import { API_URL } from "../config/api";

const AUTH_API_URL = `${API_URL}/auth/`;

const register = (username, email, password) => {
  return axios.post(AUTH_API_URL + "signup", {
    username,
    email,
    password,
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

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
