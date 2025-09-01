import axios from 'axios';

// Set the base URL for the API
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your actual API backend address
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  async getAllUsers() {
    const response = await apiClient.get('/users');
    return response.data;
  },
  async getUserById(id) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  async getCurrentUser() {
    const response = await apiClient.get('/users/current');
    return response.data;
  },
  async getUsersByRole(role) {
    const response = await apiClient.get(`/users`, {
      params: { role },
    });
    return response.data;
  },
};
