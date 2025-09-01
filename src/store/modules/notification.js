import notificationService from '@/api/notificationService';
import router from '../../router';

const state = {
  loading: false,
  error: null,
  notifications: [],
  selectedNotification: null,
};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  notifications: (state) => state.notifications,
  selectedNotification: (state) => state.selectedNotification,
};

const actions = {
  async addNotification({ commit }, notificationData) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await notificationService.addNotification(notificationData);
      commit('setLoading', false);
      //await router.push({ name: 'booksList' });
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getAllNotifications({ commit }) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const response = await notificationService.getAllNotifications();
      const notifications = response.notifications;
      commit('setNotifications', notifications);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getNotificationById({ commit }, id) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const notification = await notificationService.getNotificationById(id);
      commit('setSelectedNotification', notification);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },
  async getNotificationsByStatus({ commit }, id) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const notification = await notificationService.getNotificationsByStatus(id);
      commit('setSelectedNotification', notification);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getNotificationsByName({ commit }, name) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const notifications = await notificationService.getNotificationsByName(name);
      commit('setNotifications', notifications);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getNotificationsByUser({ commit }, requestedById) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const notifications = await notificationService.getNotificationsByUser(requestedById);
      commit('setNotifications', notifications);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async updateNotification({ commit }, { id, notificationData }) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await notificationService.updateNotification(id, notificationData);
      // Optionally refresh the notification list or selected notification
      await dispatch('getAllNotifications'); // Refresh the notification list
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async deleteNotification({ commit }, id) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await notificationService.deleteNotification(id);
      commit('removeNotification', id); // Remove notification from state
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
  setNotifications(state, notifications) {
    state.notifications = notifications;
  },
  setSelectedNotification(state, notification) {
    state.selectedNotification = notification;
  },
  removeNotification(state, id) {
    state.notifications = state.notifications.filter(notification => notification.id !== id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
