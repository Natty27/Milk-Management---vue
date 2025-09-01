// services/milkingRecordService.js
import axios from "axios";

import { API_URL } from "@/constants/apiConstants";

const milkingRecordService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  async addMilkingRecord(milkingRecordData) {
    try {
      const response = await milkingRecordService.post(
        `${API_URL}/milkingRecords`,
        milkingRecordData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllMilkingRecords() {
    try {
      const response = await milkingRecordService.get(
        `${API_URL}/milkingRecords`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getMilkingRecordById(id) {
    try {
      const response = await milkingRecordService.get(
        `${API_URL}/milkingRecords/${id}`
      );
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getMilkingRecordsByName(name) {
    try {
      const response = await milkingRecordService.get(
        `${API_URL}?name=${name}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateMilkingRecord(id, milkingRecordData) {
    try {
      const response = await milkingRecordService.patch(
        `${API_URL}/milkingRecords/${id}`,
        milkingRecordData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteMilkingRecord(id) {
    try {
      const response = await axios.delete(`${API_URL}/milkingRecords/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
