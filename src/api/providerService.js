// services/providerService.js
import axios from "axios";

import { API_URL } from "@/constants/apiConstants";

const providerService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  async addProvider(providerData) {
    try {
      const response = await providerService.post(
        `${API_URL}/milkProviders`,
        providerData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllProviders() {
    try {
      const response = await providerService.get(`${API_URL}/milkProviders`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getProviderById(id) {
    try {
      const response = await providerService.get(
        `${API_URL}/milkProviders/${id}`
      );
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getProvidersByName(name) {
    try {
      const response = await providerService.get(`${API_URL}?name=${name}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateProvider(id, providerData) {
    try {
      const response = await providerService.patch(
        `${API_URL}/milkProviders/${id}`,
        providerData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteProvider(id) {
    try {
      const response = await axios.delete(`${API_URL}/milkProviders/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
