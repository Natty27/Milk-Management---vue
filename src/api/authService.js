import axios from "axios";

import { API_URL } from "@/constants/apiConstants";

const authService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (credentials) => {
  try {
    const response = await authService.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await authService.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUsersAPI = async () => {
  try {
    const response = await authService.get("/users/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserByIDAPI = async (userId) => {
  try {
    const response = await authService.get(`/users/getUserById/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserByNameAPI = async (firstName) => {
  try {
    const response = await authService.get(`/users/getUsersByName${firstName}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUserAPI = async () => {
  try {
    // const response = await authService.get('/users/me');
    // return response.data;
  } catch (error) {
    throw error;
  }
};

export default authService;
