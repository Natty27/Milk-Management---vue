// store/modules/setting.js
import settingService from '@/api/settingService';
import router from '../../router'

const state = {
  loading: false,
  error: null,
  settings: [],
  selectedSetting: null,
};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  settings: (state) => state.settings,
  selectedSetting: (state) => state.selectedSetting,
};

const actions = {
  async addSetting({ commit }, settingData) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await settingService.addSetting(settingData);
      commit('setLoading', false);
      await router.push({ name: 'setting' });
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getAllSettings({ commit }) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const response = await settingService.getAllSettings();
      const settings = response.settings[0]; 
      commit('setSettings', settings);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getSettingById({ commit }, id) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const setting = await settingService.getSettingById(id);
      commit('setSelectedSetting', setting);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getSettingsByName({ commit }, name) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const settings = await settingService.getSettingsByName(name);
      commit('setSettings', settings);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async deleteSetting({ commit }, id) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await settingService.deleteSetting(id);
      commit('removeSetting', id); // Remove setting from state
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
      console.error('Error deleting setting in Vuex action:', error);
    }
  },

  async updateSetting({ commit }, { id, settingData }) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await settingService.updateSetting(id, settingData);
      // Optionally refresh the setting list or selected setting
      await dispatch('getAllSettings'); // Refresh the setting list
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  }
};


const mutations = {
  setLoading(state, loading) {
    state.loading = loading;
  },
  setError(state, error) {
    state.error = error;
  },
  setSettings(state, settings) {
    state.settings = settings;
  },
  setSelectedSetting(state, setting) {
    state.selectedSetting = setting;
  },
  removeSetting(state, id) {
    state.settings = state.settings.filter(setting => setting.id !== id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
