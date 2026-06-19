import axios from "axios";
import authHeader from "./auth-header";
import { API_URL } from "../config/api";

const TEST_API_URL = `${API_URL}/test/`;

const getPublicContent = () => {
  return axios.get(TEST_API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(TEST_API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(TEST_API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(TEST_API_URL + "admin", { headers: authHeader() });
};

const userService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default userService