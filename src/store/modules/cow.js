// store/modules/cow.js
import cowService from "@/api/cowService";
import router from "../../router";

const state = {
  loading: false,
  error: null,
  cows: [],
  selectedCow: null,
};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  cows: (state) => state.cows,
  selectedCow: (state) => state.selectedCow,
};

const actions = {
  async addCow({ commit }, cowData) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await cowService.addCow(cowData);
      commit("setLoading", false);
      await router.push({ name: "cow" });
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getAllCows({ commit }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const response = await cowService.getAllCows();
      const cows = response;
      commit("setCows", cows);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getCowById({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const cow = await cowService.getCowById(id);
      commit("setSelectedCow", cow);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getCowsByName({ commit }, name) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const cows = await cowService.getCowsByName(name);
      commit("setCows", cows);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async updateCow({ commit }, { id, cowData }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await cowService.updateCow(id, cowData);
      // Optionally refresh the cow list or selected cow
      await dispatch("getAllCows"); // Refresh the cow list
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async deleteCow({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await cowService.deleteCow(id);
      commit("removeCow", id); // Remove cow from state
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
  setCows(state, cows) {
    state.cows = cows;
  },
  setSelectedCow(state, cow) {
    state.selectedCow = cow;
  },
  removeCow(state, id) {
    state.cows = state.cows.filter((cow) => cow.id !== id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
