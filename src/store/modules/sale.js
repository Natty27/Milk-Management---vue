// store/modules/sale.js
import saleService from "@/api/saleService";
import router from "../../router";

const state = {
  loading: false,
  error: null,
  sales: [],
  selectedSale: null,
};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  sales: (state) => state.sales,
  selectedSale: (state) => state.selectedSale,
};

const actions = {
  async addSale({ commit }, saleData) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await saleService.addSale(saleData);
      commit("setLoading", false);
      await router.push({ name: "sale" });
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getAllSales({ commit }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const response = await saleService.getAllSales();
      const sales = response;
      commit("setSales", sales);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getSaleById({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const sale = await saleService.getSaleById(id);
      commit("setSelectedSale", sale);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getSalesByName({ commit }, name) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const sales = await saleService.getSalesByName(name);
      commit("setSales", sales);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async updateSale({ commit }, { id, saleData }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await saleService.updateSale(id, saleData);
      // Optionally refresh the sale list or selected sale
      await dispatch("getAllSales"); // Refresh the sale list
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async deleteSale({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await saleService.deleteSale(id);
      commit("removeSale", id); // Remove sale from state
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },
};

const mutations = {
  setLoading(state, loading) {
    state.loading = loading;
  },
  setError(state, error) {
    state.error = error;
  },
  setSales(state, sales) {
    state.sales = sales;
  },
  setSelectedSale(state, sale) {
    state.selectedSale = sale;
  },
  removeSale(state, id) {
    state.sales = state.sales.filter((sale) => sale.id !== id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
