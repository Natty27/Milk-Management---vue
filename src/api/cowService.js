// services/cowService.js
import axios from "axios";

import { API_URL } from "@/constants/apiConstants";

const cowService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  async addCow(cowData) {
    try {
      const response = await cowService.post(`${API_URL}/cows`, cowData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllCows() {
    try {
      const response = await cowService.get(`${API_URL}/cows`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCowById(id) {
    try {
      const response = await cowService.get(`${API_URL}/cows/${id}`);
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getCowsByName(name) {
    try {
      const response = await cowService.get(`${API_URL}?name=${name}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateCow(id, cowData) {
    try {
      const response = await cowService.patch(`${API_URL}/cows/${id}`, cowData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteCow(id) {
    try {
      const response = await axios.delete(`${API_URL}/cows/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
