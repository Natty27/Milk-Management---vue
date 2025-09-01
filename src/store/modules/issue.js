import issueService from '@/api/issueService';
import router from '../../router';

const state = {
  loading: false,
  error: null,
  issues: [],
  selectedIssue: null,
};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  issues: (state) => state.issues,
  selectedIssue: (state) => state.selectedIssue,
};

const actions = {
  async addIssue({ commit }, issueData) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await issueService.addIssue(issueData);
      commit('setLoading', false);
      //await router.push({ name: 'booksList' });
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getAllIssues({ commit }) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const response = await issueService.getAllIssues();
      const issues = response.issues;
      commit('setIssues', issues);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getIssueById({ commit }, id) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const issue = await issueService.getIssueById(id);
      commit('setSelectedIssue', issue);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },
  async getIssuesByStatus({ commit }, id) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const issue = await issueService.getIssuesByStatus(id);
      commit('setSelectedIssue', issue);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getIssuesByName({ commit }, name) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const issues = await issueService.getIssuesByName(name);
      commit('setIssues', issues);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getIssuesByUser({ commit }, requestedById) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const issues = await issueService.getIssuesByUser(requestedById);
      commit('setIssues', issues);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async updateIssue({ commit }, { id, issueData }) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await issueService.updateIssue(id, issueData);
      // Optionally refresh the issue list or selected issue
      await dispatch('getAllIssues'); // Refresh the issue list
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async deleteIssue({ commit }, id) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await issueService.deleteIssue(id);
      commit('removeIssue', id); // Remove issue from state
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
  setIssues(state, issues) {
    state.issues = issues;
  },
  setSelectedIssue(state, issue) {
    state.selectedIssue = issue;
  },
  removeIssue(state, id) {
    state.issues = state.issues.filter(issue => issue.id !== id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
