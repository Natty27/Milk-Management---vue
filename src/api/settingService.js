// services/settingService.js
import axios from 'axios';

import { API_URL } from '@/constants/apiConstants';

const settingService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  async addSetting(settingData) {
    try {
      const response = await settingService.post(`${API_URL}/setting/save`, settingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllSettings() {
    try {
      const response = await settingService.get(`${API_URL}/setting/allsettings`);
      //console.log(response)
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getSettingById(id) {
    try {
      const response = await settingService.get(`${API_URL}/setting/getAllSettings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getSettingsByName(name) {
    try {
      const response = await settingService.get(`${API_URL}?name=${name}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteSetting(id) {
    try {
      const response = await axios.delete(`${API_URL}/setting/deleteSetting/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateSetting(id, settingData) {
    try {
      const response = await settingService.put(`${API_URL}/setting/updateSetting/${id}`, settingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
