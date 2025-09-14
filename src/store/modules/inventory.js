// store/modules/inventory.js
import inventoryService from "@/api/inventoryService";
import router from "../../router";

const state = {
  loading: false,
  error: null,
  inventorys: [],
  selectedInventory: null,
};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  inventorys: (state) => state.inventorys,
  selectedInventory: (state) => state.selectedInventory,
};

const actions = {
  async addInventory({ commit }, inventoryData) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await inventoryService.addInventory(inventoryData);
      commit("setLoading", false);
      await router.push({ name: "inventory" });
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getAllInventorys({ commit }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const response = await inventoryService.getAllInventorys();
      const inventorys = response;
      commit("setInventorys", inventorys);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getInventoryById({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const inventory = await inventoryService.getInventoryById(id);
      commit("setSelectedInventory", inventory);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getInventorysByName({ commit }, name) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const inventorys = await inventoryService.getInventorysByName(name);
      commit("setInventorys", inventorys);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async updateInventory({ commit }, { id, inventoryData }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await inventoryService.updateInventory(id, inventoryData);
      // Optionally refresh the inventory list or selected inventory
      await dispatch("getAllInventorys"); // Refresh the inventory list
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async deleteInventory({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await inventoryService.deleteInventory(id);
      commit("removeInventory", id); // Remove inventory from state
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
  setInventorys(state, inventorys) {
    state.inventorys = inventorys;
  },
  setSelectedInventory(state, inventory) {
    state.selectedInventory = inventory;
  },
  removeInventory(state, id) {
    state.inventorys = state.inventorys.filter(
      (inventory) => inventory.id !== id
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
