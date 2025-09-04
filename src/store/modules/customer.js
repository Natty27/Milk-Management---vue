// store/modules/customer.js
import customerService from "@/api/customerService";
import router from "../../router";

const state = {
  loading: false,
  error: null,
  customers: [],
  overDueCustomers: [],
  selectedCustomer: null,
};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  customers: (state) => state.customers,
  overDueCustomers: (state) => state.overDueCustomers,
  selectedCustomer: (state) => state.selectedCustomer,
};

const actions = {
  async addCustomer({ commit }, customerData) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await customerService.addCustomer(customerData);
      commit("setLoading", false);
      await router.push({ name: "customer" });
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getAllCustomers({ commit }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const response = await customerService.getAllCustomers();
      const customers = response;
      commit("setCustomers", customers);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getOverDueCustomers({ commit }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const response = await customerService.getOverDueCustomers();
      const customers = response;
      commit("setOverDueCustomers", customers);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async processMakePayment({ commit }, { id }) {
    console.log("Action processMakePayment called with ID:", id);

    commit("setLoading", true);
    commit("setError", null);
    try {
      await customerService.processMakePayment(id);
      commit("setLoading", false);
      await router.push({ name: "customer" });
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getCustomerById({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const customer = await customerService.getCustomerById(id);
      commit("setSelectedCustomer", customer);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getCustomersByName({ commit }, name) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const customers = await customerService.getCustomersByName(name);
      commit("setCustomers", customers);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async updateCustomer({ commit }, { id, customerData }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await customerService.updateCustomer(id, customerData);
      // Optionally refresh the customer list or selected customer
      await dispatch("getAllCustomers"); // Refresh the customer list
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async deleteCustomer({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await customerService.deleteCustomer(id);
      commit("removeCustomer", id); // Remove customer from state
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
  setCustomers(state, customers) {
    state.customers = customers;
  },
  setOverDueCustomers(state, customers) {
    state.overDueCustomers = customers;
  },
  setSelectedCustomer(state, customer) {
    state.selectedCustomer = customer;
  },
  removeCustomer(state, id) {
    state.customers = state.customers.filter((customer) => customer.id !== id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
