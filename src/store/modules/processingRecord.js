// store/modules/processingRecord.js
import processingRecordService from "@/api/processingRecordService";
import router from "../../router";

const state = {
  loading: false,
  error: null,
  processingRecords: [],
  selectedProcessingRecord: null,
};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  processingRecords: (state) => state.processingRecords,
  selectedProcessingRecord: (state) => state.selectedProcessingRecord,
};

const actions = {
  async addProcessingRecord({ commit }, processingRecordData) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await processingRecordService.addProcessingRecord(processingRecordData);
      commit("setLoading", false);
      await router.push({ name: "processingRecord" });
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getAllProcessingRecords({ commit }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const response = await processingRecordService.getAllProcessingRecords();
      const processingRecords = response;
      commit("setProcessingRecords", processingRecords);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getProcessingRecordById({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const processingRecord =
        await processingRecordService.getProcessingRecordById(id);
      commit("setSelectedProcessingRecord", processingRecord);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getProcessingRecordsByName({ commit }, name) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const processingRecords =
        await processingRecordService.getProcessingRecordsByName(name);
      commit("setProcessingRecords", processingRecords);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async updateProcessingRecord({ commit }, { id, processingRecordData }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await processingRecordService.updateProcessingRecord(
        id,
        processingRecordData
      );
      // Optionally refresh the processingRecord list or selected processingRecord
      await dispatch("getAllProcessingRecords"); // Refresh the processingRecord list
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async deleteProcessingRecord({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await processingRecordService.deleteProcessingRecord(id);
      commit("removeProcessingRecord", id); // Remove processingRecord from state
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
  setProcessingRecords(state, processingRecords) {
    state.processingRecords = processingRecords;
  },
  setSelectedProcessingRecord(state, processingRecord) {
    state.selectedProcessingRecord = processingRecord;
  },
  removeProcessingRecord(state, id) {
    state.processingRecords = state.processingRecords.filter(
      (processingRecord) => processingRecord.id !== id
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
