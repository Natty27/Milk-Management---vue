import axios from 'axios';

import { API_URL } from '@/constants/apiConstants';

const notificationService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  async addNotification(notificationData) {
    try {
      console.log('sent', notificationData);
      const response = await notificationService.post(`${API_URL}/notifications/save`, notificationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllNotifications() {
    try {
      const response = await notificationService.get(`${API_URL}/notifications/allnotifications`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getNotificationById(id) {
    try {
      const response = await notificationService.get(`${API_URL}/notifications/getNotificationById/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getNotificationsByStatus(status) {
    try {
      const response = await notificationService.get(`${API_URL}/notifications/getNotificationsByStatus/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getNotificationsByName(name) {
    try {
      const response = await notificationService.get(`${API_URL}?name=${name}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getNotificationsByUser(requestedById) {
    try {
      const response = await notificationService.get(`${API_URL}/notifications/getNotificationsByUser/${requestedById}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateNotification(id, notificationData) {
    try {
      const response = await notificationService.put(`${API_URL}/notification/updateNotification/${id}`, notificationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteNotification(id) {
    try {
      const response = await axios.delete(`${API_URL}/notification/deleteNotification/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
