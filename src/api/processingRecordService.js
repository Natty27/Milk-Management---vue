// services/processingRecordService.js
import axios from "axios";

import { API_URL } from "@/constants/apiConstants";

const processingRecordService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  async addProcessingRecord(processingRecordData) {
    try {
      const response = await processingRecordService.post(
        `${API_URL}/processing`,
        processingRecordData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllProcessingRecords() {
    try {
      const response = await processingRecordService.get(
        `${API_URL}/processing`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getProcessingRecordById(id) {
    try {
      const response = await processingRecordService.get(
        `${API_URL}/processing/${id}`
      );
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getProcessingRecordsByName(name) {
    try {
      const response = await processingRecordService.get(
        `${API_URL}?name=${name}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateProcessingRecord(id, processingRecordData) {
    try {
      const response = await processingRecordService.patch(
        `${API_URL}/processing/${id}`,
        processingRecordData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteProcessingRecord(id) {
    try {
      const response = await axios.delete(`${API_URL}/processing/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
