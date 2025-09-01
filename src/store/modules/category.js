// store/modules/category.js
import categoryService from '@/api/categoryService';
import router from '../../router'

const state = {
  loading: false,
  error: null,
  categorys: [],
  selectedCategory: null,
};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  categorys: (state) => state.categorys,
  selectedCategory: (state) => state.selectedCategory,
};

const actions = {
  async addCategory({ commit }, categoryData) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await categoryService.addCategory(categoryData);
      commit('setLoading', false);
      await router.push({ name: 'category' });
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getAllCategorys({ commit }) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const response = await categoryService.getAllCategorys();
      const categorys = response.categorys; 
      commit('setCategorys', categorys);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getCategoryById({ commit }, id) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const category = await categoryService.getCategoryById(id);
      commit('setSelectedCategory', category);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async getCategorysByName({ commit }, name) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      const categorys = await categoryService.getCategorysByName(name);
      commit('setCategorys', categorys);
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
    }
  },

  async deleteCategory({ commit }, id) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await categoryService.deleteCategory(id);
      commit('removeCategory', id); // Remove category from state
      commit('setLoading', false);
    } catch (error) {
      commit('setError', error);
      commit('setLoading', false);
      console.error('Error deleting category in Vuex action:', error);
    }
  },

  async updateCategory({ commit }, { id, categoryData }) {
    commit('setLoading', true);
    commit('setError', null);
    try {
      await categoryService.updateCategory(id, categoryData);
      // Optionally refresh the category list or selected category
      await dispatch('getAllCategorys'); // Refresh the category list
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
  setCategorys(state, categorys) {
    state.categorys = categorys;
  },
  setSelectedCategory(state, category) {
    state.selectedCategory = category;
  },
  removeCategory(state, id) {
    state.categorys = state.categorys.filter(category => category.id !== id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
