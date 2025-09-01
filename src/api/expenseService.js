// services/expenseService.js
import axios from "axios";

import { API_URL } from "@/constants/apiConstants";

const expenseService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  async addExpense(expenseData) {
    try {
      const response = await expenseService.post(
        `${API_URL}/expenses`,
        expenseData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllExpenses() {
    try {
      const response = await expenseService.get(`${API_URL}/expenses`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getExpenseById(id) {
    try {
      const response = await expenseService.get(`${API_URL}/expenses/${id}`);
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getExpensesByName(name) {
    try {
      const response = await expenseService.get(`${API_URL}?name=${name}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateExpense(id, expenseData) {
    try {
      const response = await expenseService.patch(
        `${API_URL}/expenses/${id}`,
        expenseData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteExpense(id) {
    try {
      const response = await axios.delete(`${API_URL}/expenses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
