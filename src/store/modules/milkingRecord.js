// store/modules/milkingRecord.js
import milkingRecordService from "@/api/milkingRecordService";
import router from "../../router";

const state = {
  loading: false,
  error: null,
  milkingRecords: [],
  selectedMilkingRecord: null,
};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  milkingRecords: (state) => state.milkingRecords,
  selectedMilkingRecord: (state) => state.selectedMilkingRecord,
};

const actions = {
  async addMilkingRecord({ commit }, milkingRecordData) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await milkingRecordService.addMilkingRecord(milkingRecordData);
      commit("setLoading", false);
      await router.push({ name: "milkingRecord" });
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getAllMilkingRecords({ commit }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const response = await milkingRecordService.getAllMilkingRecords();
      const milkingRecords = response;
      commit("setMilkingRecords", milkingRecords);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getMilkingRecordById({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const milkingRecord = await milkingRecordService.getMilkingRecordById(id);
      commit("setSelectedMilkingRecord", milkingRecord);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getMilkingRecordsByName({ commit }, name) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const milkingRecords = await milkingRecordService.getMilkingRecordsByName(
        name
      );
      commit("setMilkingRecords", milkingRecords);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async updateMilkingRecord({ commit }, { id, milkingRecordData }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await milkingRecordService.updateMilkingRecord(id, milkingRecordData);
      // Optionally refresh the milkingRecord list or selected milkingRecord
      await dispatch("getAllMilkingRecords"); // Refresh the milkingRecord list
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async deleteMilkingRecord({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await milkingRecordService.deleteMilkingRecord(id);
      commit("removeMilkingRecord", id); // Remove milkingRecord from state
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
  setMilkingRecords(state, milkingRecords) {
    state.milkingRecords = milkingRecords;
  },
  setSelectedMilkingRecord(state, milkingRecord) {
    state.selectedMilkingRecord = milkingRecord;
  },
  removeMilkingRecord(state, id) {
    state.milkingRecords = state.milkingRecords.filter(
      (milkingRecord) => milkingRecord.id !== id
    );
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
