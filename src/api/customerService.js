// services/customerService.js
import axios from "axios";

import { API_URL } from "@/constants/apiConstants";

const customerService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  async addCustomer(customerData) {
    try {
      const response = await customerService.post(
        `${API_URL}/customers`,
        customerData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllCustomers() {
    try {
      const response = await customerService.get(`${API_URL}/customers`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getOverDueCustomers() {
    try {
      const response = await customerService.get(
        `${API_URL}/customers/overdue`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getPaymentHistorys() {
    try {
      const response = await customerService.get(`${API_URL}/payment-history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async processMakePayment(id, amount) {
    console.log("Processing payment for customer ID:", id);
    try {
      const response = await customerService.post(
        `${API_URL}/customers/${id}/payment`,
        {
          amount: amount,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCustomerById(id) {
    try {
      const response = await customerService.get(`${API_URL}/customers/${id}`);
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async getCustomersByName(name) {
    try {
      const response = await customerService.get(`${API_URL}?name=${name}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateCustomer(id, customerData) {
    try {
      const response = await customerService.patch(
        `${API_URL}/customers/${id}`,
        customerData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updatePaymentRequest(id, paymentHistoryData) {
    try {
      const response = await customerService.patch(
        `${API_URL}/payment-history/${id}`,
        paymentHistoryData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteCustomer(id) {
    try {
      const response = await axios.delete(`${API_URL}/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
