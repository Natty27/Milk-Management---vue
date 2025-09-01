// services/logService.js
import axios from 'axios';

import { API_URL } from '@/constants/apiConstants';

const logService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  async addLog(logData) {
    try {
      const response = await logService.post(`${API_URL}/log/save`, logData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllLogs() {
    try {
      const response = await logService.get(`${API_URL}/log/alllogs`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getLogById(id) {
    try {
      const response = await logService.get(`${API_URL}/log/getAllLogs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getLogsByName(name) {
    try {
      const response = await logService.get(`${API_URL}?name=${name}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteLog(id) {
    try {
      const response = await axios.delete(`${API_URL}/log/deleteLog/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateLog(id, logData) {
    try {
      const response = await logService.put(`${API_URL}/log/updateLog/${id}`, logData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
