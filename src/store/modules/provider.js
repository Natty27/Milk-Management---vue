// store/modules/provider.js
import providerService from "@/api/providerService";
import router from "../../router";

const state = {
  loading: false,
  error: null,
  providers: [],
  selectedProvider: null,
};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  providers: (state) => state.providers,
  selectedProvider: (state) => state.selectedProvider,
};

const actions = {
  async addProvider({ commit }, providerData) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await providerService.addProvider(providerData);
      commit("setLoading", false);
      await router.push({ name: "provider" });
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getAllProviders({ commit }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const response = await providerService.getAllProviders();
      const providers = response;
      commit("setProviders", providers);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getProviderById({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const provider = await providerService.getProviderById(id);
      commit("setSelectedProvider", provider);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getProvidersByName({ commit }, name) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const providers = await providerService.getProvidersByName(name);
      commit("setProviders", providers);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async updateProvider({ commit }, { id, providerData }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await providerService.updateProvider(id, providerData);
      // Optionally refresh the provider list or selected provider
      await dispatch("getAllProviders"); // Refresh the provider list
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async deleteProvider({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await providerService.deleteProvider(id);
      commit("removeProvider", id); // Remove provider from state
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
  setProviders(state, providers) {
    state.providers = providers;
  },
  setSelectedProvider(state, provider) {
    state.selectedProvider = provider;
  },
  removeProvider(state, id) {
    state.providers = state.providers.filter((provider) => provider.id !== id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
