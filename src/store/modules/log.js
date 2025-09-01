import logService from '@/api/logService';
import router from '../../router';

const state = {
  loading: false,
  error: null,
  logs: [],
  selectedLog: null,
};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  logs: (state) => state.logs,
  selectedLog: (state) => state.selectedLog,
};

const actions = {
  async addLog({ commit }, logData) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await logService.addLog(logData);
      commit('setLoading', false);
      //await router.push({ name: 'booksList' });
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getAllLogs({ commit }) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const response = await logService.getAllLogs();
      const logs = response.logs;
      commit('setLogs', logs);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getLogById({ commit }, id) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const log = await logService.getLogById(id);
      commit('setSelectedLog', log);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },
  async getLogsByStatus({ commit }, id) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const log = await logService.getLogsByStatus(id);
      commit('setSelectedLog', log);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getLogsByName({ commit }, name) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const logs = await logService.getLogsByName(name);
      commit('setLogs', logs);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getLogsByUser({ commit }, requestedById) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const logs = await logService.getLogsByUser(requestedById);
      commit('setLogs', logs);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async updateLog({ commit }, { id, logData }) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await logService.updateLog(id, logData);
      // Optionally refresh the log list or selected log
      await dispatch('getAllLogs'); // Refresh the log list
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async deleteLog({ commit }, id) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await logService.deleteLog(id);
      commit('removeLog', id); // Remove log from state
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
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
  setLogs(state, logs) {
    state.logs = logs;
  },
  setSelectedLog(state, log) {
    state.selectedLog = log;
  },
  removeLog(state, id) {
    state.logs = state.logs.filter(log => log.id !== id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
