// store/modules/expense.js
import expenseService from "@/api/expenseService";
import router from "../../router";

const state = {
  loading: false,
  error: null,
  expenses: [],
  selectedExpense: null,
};

const getters = {
  loading: (state) => state.loading,
  error: (state) => state.error,
  expenses: (state) => state.expenses,
  selectedExpense: (state) => state.selectedExpense,
};

const actions = {
  async addExpense({ commit }, expenseData) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await expenseService.addExpense(expenseData);
      commit("setLoading", false);
      await router.push({ name: "expense" });
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getAllExpenses({ commit }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const response = await expenseService.getAllExpenses();
      const expenses = response;
      commit("setExpenses", expenses);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getExpenseById({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const expense = await expenseService.getExpenseById(id);
      commit("setSelectedExpense", expense);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async getExpensesByName({ commit }, name) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      const expenses = await expenseService.getExpensesByName(name);
      commit("setExpenses", expenses);
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async updateExpense({ commit }, { id, expenseData }) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await expenseService.updateExpense(id, expenseData);
      // Optionally refresh the expense list or selected expense
      await dispatch("getAllExpenses"); // Refresh the expense list
      commit("setLoading", false);
    } catch (error) {
      commit("setError", error);
      commit("setLoading", false);
    }
  },

  async deleteExpense({ commit }, id) {
    commit("setLoading", true);
    commit("setError", null);
    try {
      await expenseService.deleteExpense(id);
      commit("removeExpense", id); // Remove expense from state
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
  setExpenses(state, expenses) {
    state.expenses = expenses;
  },
  setSelectedExpense(state, expense) {
    state.selectedExpense = expense;
  },
  removeExpense(state, id) {
    state.expenses = state.expenses.filter((expense) => expense.id !== id);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
