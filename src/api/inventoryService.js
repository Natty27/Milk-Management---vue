// services/inventoryService.js
import axios from "axios";

import { API_URL } from "@/constants/apiConstants";

const inventoryService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  async addInventory(inventoryData) {
    try {
      const response = await inventoryService.post(
        `${API_URL}/milk-inventory`,
        inventoryData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllInventorys() {
    try {
      const response = await inventoryService.get(`${API_URL}/milk-inventory`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getInventoryById(id) {
    try {
      const response = await inventoryService.get(
        `${API_URL}/milk-inventory/${id}`
      );
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getInventorysByName(name) {
    try {
      const response = await inventoryService.get(`${API_URL}?name=${name}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateInventory(id, inventoryData) {
    try {
      const response = await inventoryService.patch(
        `${API_URL}/milk-inventory/${id}`,
        inventoryData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteInventory(id) {
    try {
      const response = await axios.delete(`${API_URL}/milk-inventory/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
