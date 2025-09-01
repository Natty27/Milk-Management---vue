// store/modules/report.js
import reportService from "./../../api/reportService";

const state = {
  loading: false,
  error: null,
  expenseReport: null,
  revenueReport: null,
  profitLossReport: null,
  cowProductionReport: null,
  customerReport: null,
  dashboardSummary: null,
  healthReport: null,
  currentReportType: null,
};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  expenseReport: (state) => state.expenseReport,
  revenueReport: (state) => state.revenueReport,
  profitLossReport: (state) => state.profitLossReport,
  cowProductionReport: (state) => state.cowProductionReport,
  customerReport: (state) => state.customerReport,
  dashboardSummary: (state) => state.dashboardSummary,
  healthReport: (state) => state.healthReport,
  currentReportType: (state) => state.currentReportType,
};

const actions = {
  // Expense Report
  async getExpenseReport(
    { commit },
    { startDate = null, endDate = null } = {}
  ) {
    commit("setLoading", true);
    commit("setError", null);
    commit("setCurrentReportType", "expense");
    try {
      const report = await reportService.getExpenseReport(startDate, endDate);
      commit("setExpenseReport", report);
      commit("setLoading", false);
      return report;
    } catch (error) {
      commit("setError", error.message || "Failed to load expense report");
      commit("setLoading", false);
      throw error;
    }
  },

  // Revenue Report
  async getRevenueReport(
    { commit },
    { startDate = null, endDate = null } = {}
  ) {
    commit("setLoading", true);
    commit("setError", null);
    commit("setCurrentReportType", "revenue");
    try {
      const report = await reportService.getRevenueReport(startDate, endDate);
      commit("setRevenueReport", report);
      commit("setLoading", false);
      return report;
    } catch (error) {
      commit("setError", error.message || "Failed to load revenue report");
      commit("setLoading", false);
      throw error;
    }
  },

  // Profit & Loss Report
  async getProfitLossReport(
    { commit },
    { startDate = null, endDate = null } = {}
  ) {
    commit("setLoading", true);
    commit("setError", null);
    commit("setCurrentReportType", "profitLoss");
    try {
      const report = await reportService.getProfitLossReport(
        startDate,
        endDate
      );
      commit("setProfitLossReport", report);
      commit("setLoading", false);
      return report;
    } catch (error) {
      commit("setError", error.message || "Failed to load profit/loss report");
      commit("setLoading", false);
      throw error;
    }
  },

  // Cow Production Report
  async getCowProductionReport(
    { commit },
    { cowId = null, startDate = null, endDate = null } = {}
  ) {
    commit("setLoading", true);
    commit("setError", null);
    commit("setCurrentReportType", "cowProduction");
    try {
      const report = await reportService.getCowProductionReport(
        cowId,
        startDate,
        endDate
      );
      commit("setCowProductionReport", report);
      commit("setLoading", false);
      return report;
    } catch (error) {
      commit(
        "setError",
        error.message || "Failed to load cow production report"
      );
      commit("setLoading", false);
      throw error;
    }
  },

  // Customer Report
  async getCustomerReport(
    { commit },
    { startDate = null, endDate = null } = {}
  ) {
    commit("setLoading", true);
    commit("setError", null);
    commit("setCurrentReportType", "customer");
    try {
      const report = await reportService.getCustomerReport(startDate, endDate);
      commit("setCustomerReport", report);
      commit("setLoading", false);
      return report;
    } catch (error) {
      commit("setError", error.message || "Failed to load customer report");
      commit("setLoading", false);
      throw error;
    }
  },

  // Dashboard Summary
  async getDashboardSummary({ commit }) {
    commit("setLoading", true);
    commit("setError", null);
    commit("setCurrentReportType", "dashboard");
    try {
      const summary = await reportService.getDashboardSummary();
      commit("setDashboardSummary", summary);
      commit("setLoading", false);
      return summary;
    } catch (error) {
      commit("setError", error.message || "Failed to load dashboard summary");
      commit("setLoading", false);
      throw error;
    }
  },

  // Health Report
  async getHealthReport({ commit }) {
    commit("setLoading", true);
    commit("setError", null);
    commit("setCurrentReportType", "health");
    try {
      const report = await reportService.getHealthReport();
      commit("setHealthReport", report);
      commit("setLoading", false);
      return report;
    } catch (error) {
      commit("setError", error.message || "Failed to load health report");
      commit("setLoading", false);
      throw error;
    }
  },

  // Clear all reports
  clearAllReports({ commit }) {
    commit("clearAllReports");
  },

  // Clear specific report
  clearReport({ commit }, reportType) {
    commit("clearReport", reportType);
  },

  // Clear error
  clearError({ commit }) {
    commit("setError", null);
  },
};

const mutations = {
  setLoading(state, loading) {
    state.loading = loading;
  },
  setError(state, error) {
    state.error = error;
  },
  setExpenseReport(state, report) {
    state.expenseReport = report;
  },
  setRevenueReport(state, report) {
    state.revenueReport = report;
  },
  setProfitLossReport(state, report) {
    state.profitLossReport = report;
  },
  setCowProductionReport(state, report) {
    state.cowProductionReport = report;
  },
  setCustomerReport(state, report) {
    state.customerReport = report;
  },
  setDashboardSummary(state, summary) {
    state.dashboardSummary = summary;
  },
  setHealthReport(state, report) {
    state.healthReport = report;
  },
  setCurrentReportType(state, reportType) {
    state.currentReportType = reportType;
  },
  clearAllReports(state) {
    state.expenseReport = null;
    state.revenueReport = null;
    state.profitLossReport = null;
    state.cowProductionReport = null;
    state.customerReport = null;
    state.dashboardSummary = null;
    state.healthReport = null;
    state.currentReportType = null;
  },
  clearReport(state, reportType) {
    switch (reportType) {
      case "expense":
        state.expenseReport = null;
        break;
      case "revenue":
        state.revenueReport = null;
        break;
      case "profitLoss":
        state.profitLossReport = null;
        break;
      case "cowProduction":
        state.cowProductionReport = null;
        break;
      case "customer":
        state.customerReport = null;
        break;
      case "dashboard":
        state.dashboardSummary = null;
        break;
      case "health":
        state.healthReport = null;
        break;
    }
    if (state.currentReportType === reportType) {
      state.currentReportType = null;
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
