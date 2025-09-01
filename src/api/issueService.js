import axios from 'axios';

import { API_URL } from '@/constants/apiConstants';

const issueService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  async addIssue(issueData) {
    try {
      console.log('sent', issueData);
      const response = await issueService.post(`${API_URL}/issues/save`, issueData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllIssues() {
    try {
      const response = await issueService.get(`${API_URL}/issues/allissues`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getIssueById(id) {
    try {
      const response = await issueService.get(`${API_URL}/issues/getIssueById/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getIssuesByStatus(status) {
    try {
      const response = await issueService.get(`${API_URL}/issues/getIssuesByStatus/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getIssuesByName(name) {
    try {
      const response = await issueService.get(`${API_URL}?name=${name}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getIssuesByUser(requestedById) {
    try {
      const response = await issueService.get(`${API_URL}/issues/getIssuesByUser/${requestedById}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateIssue(id, issueData) {
    try {
      const response = await issueService.put(`${API_URL}/issue/updateIssue/${id}`, issueData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteIssue(id) {
    try {
      const response = await axios.delete(`${API_URL}/issue/deleteIssue/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
