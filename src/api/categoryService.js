// services/categoryService.js
import axios from 'axios';

import { API_URL } from '@/constants/apiConstants';

const categoryService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  async addCategory(categoryData) {
    try {
      const response = await categoryService.post(`${API_URL}/category/save`, categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllCategorys() {
    try {
      const response = await categoryService.get(`${API_URL}/category/allcategorys`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCategoryById(id) {
    try {
      const response = await categoryService.get(`${API_URL}/category/getAllCategorys/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCategorysByName(name) {
    try {
      const response = await categoryService.get(`${API_URL}?name=${name}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteCategory(id) {
    try {
      const response = await axios.delete(`${API_URL}/category/deleteCategory/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateCategory(id, categoryData) {
    try {
      const response = await categoryService.put(`${API_URL}/category/updateCategory/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
