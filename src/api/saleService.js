// services/saleService.js
import axios from "axios";

import { API_URL } from "@/constants/apiConstants";

const saleService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  async addSale(saleData) {
    try {
      const response = await saleService.post(`${API_URL}/sales`, saleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllSales() {
    try {
      const response = await saleService.get(`${API_URL}/sales`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getSaleById(id) {
    try {
      const response = await saleService.get(`${API_URL}/sales/${id}`);
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getSalesByName(name) {
    try {
      const response = await saleService.get(`${API_URL}?name=${name}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateSale(id, saleData) {
    try {
      const response = await saleService.patch(
        `${API_URL}/sales/${id}`,
        saleData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteSale(id) {
    try {
      const response = await axios.delete(`${API_URL}/sales/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
