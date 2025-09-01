// services/reportService.js
import axios from "axios";
import { API_URL } from "@/constants/apiConstants";

const reportService = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  // Expense Reports
  async getExpenseReport(startDate = null, endDate = null) {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await reportService.get(`${API_URL}/reports/expenses`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Revenue Reports
  async getRevenueReport(startDate = null, endDate = null) {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await reportService.get(`${API_URL}/reports/revenue`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Profit & Loss Reports
  async getProfitLossReport(startDate = null, endDate = null) {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await reportService.get(
        `${API_URL}/reports/profit-loss`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cow Production Reports
  async getCowProductionReport(cowId = null, startDate = null, endDate = null) {
    try {
      const params = {};
      if (cowId) params.cowId = cowId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await reportService.get(
        `${API_URL}/reports/cow-production`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Customer Analysis Reports
  async getCustomerReport(startDate = null, endDate = null) {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await reportService.get(`${API_URL}/reports/customers`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Dashboard Summary
  async getDashboardSummary() {
    try {
      const response = await reportService.get(`${API_URL}/reports/dashboard`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // System Health Report
  async getHealthReport() {
    try {
      const response = await reportService.get(`${API_URL}/reports/health`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Utility function to format date for API (YYYY-MM-DD)
  formatDateForAPI(date) {
    if (!date) return null;

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  },

  // Helper function to get current month date range
  getCurrentMonthRange() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      startDate: this.formatDateForAPI(startOfMonth),
      endDate: this.formatDateForAPI(endOfMonth),
    };
  },

  // Helper function to get current year date range
  getCurrentYearRange() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);

    return {
      startDate: this.formatDateForAPI(startOfYear),
      endDate: this.formatDateForAPI(endOfYear),
    };
  },

  // Helper function to get last 30 days range
  getLast30DaysRange() {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    return {
      startDate: this.formatDateForAPI(thirtyDaysAgo),
      endDate: this.formatDateForAPI(now),
    };
  },
};
