import {
  login,
  register,
  getAllUsersAPI,
  getUserByIDAPI,
  getUserByNameAPI,
  getCurrentUserAPI,
} from "../../api/authService";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  GET_USER_BY_ID_REQUEST,
  GET_USER_BY_ID_SUCCESS,
  GET_USER_BY_ID_FAILURE,
  GET_USER_BY_NAME_REQUEST,
  GET_USER_BY_NAME_SUCCESS,
  GET_USER_BY_NAME_FAILURE,
  GET_CURRENT_USER_REQUEST,
  GET_CURRENT_USER_SUCCESS,
  GET_CURRENT_USER_FAILURE,
} from "../../constants/actionTypes";
import router from "../../router";

const state = {
  token: localStorage.getItem("token") || "",
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (e) {
      return null;
    }
  })(),
  loading: false,
  error: null,
  users: [],
  currentUser: null,
};

const mutations = {
  [LOGIN_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [LOGIN_SUCCESS](state, { token, refreshToken, userId, username }) {
    state.loading = false;
    state.token = token;
    state.refreshToken = refreshToken;
    state.userId = userId;
    state.username = username; // Store username in state

    // Store in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username); // Store username
  },
  [LOGIN_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [REGISTER_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [REGISTER_SUCCESS](state, { token, user }) {
    state.loading = false;
    state.token = token;
    state.user = user;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },
  [REGISTER_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [GET_USERS_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [GET_USERS_SUCCESS](state, users) {
    state.loading = false;
    state.users = users;
  },
  [GET_USERS_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [GET_USER_BY_ID_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [GET_USER_BY_ID_SUCCESS](state, user) {
    state.loading = false;
    state.currentUser = user;
  },
  [GET_USER_BY_ID_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [GET_USER_BY_NAME_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [GET_USER_BY_NAME_SUCCESS](state, user) {
    state.loading = false;
    state.currentUser = user;
  },
  [GET_USER_BY_NAME_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  [GET_CURRENT_USER_REQUEST](state) {
    state.loading = true;
    state.error = null;
  },
  [GET_CURRENT_USER_SUCCESS](state, user) {
    state.loading = false;
    state.currentUser = user;
  },
  [GET_CURRENT_USER_FAILURE](state, error) {
    state.loading = false;
    state.error = error;
  },
  logout(state) {
    state.token = "";
    state.user = null;
    state.currentUser = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

const actions = {
  async login({ commit }, credentials) {
    commit(LOGIN_REQUEST);
    try {
      const { accessToken, refreshToken, userId, username } = await login(
        credentials
      );
      commit(LOGIN_SUCCESS, {
        token: accessToken,
        refreshToken,
        userId,
        username, // Add username to the commit
      });
      console.log("Login successful, redirecting to dashboard...");
      await router.push({ name: "dashboard" });
    } catch (error) {
      console.error("Login error:", error);
      commit(LOGIN_FAILURE, error);
    }
  },
  async register({ commit }, userData) {
    commit(REGISTER_REQUEST);
    try {
      const { access_token: token, user } = await register(userData);
      commit(REGISTER_SUCCESS, { token, user });
      console.log("Registration successful, redirecting to dashboard...");
      await router.push({ name: "dashboard" });
    } catch (error) {
      console.error("Registration error:", error);
      commit(REGISTER_FAILURE, error);
    }
  },
  async getAllUsers({ commit }) {
    commit(GET_USERS_REQUEST);
    try {
      const users = await getAllUsersAPI();
      commit(GET_USERS_SUCCESS, users);
    } catch (error) {
      console.error("Error fetching users:", error);
      commit(GET_USERS_FAILURE, error);
    }
  },
  async getUserByID({ commit }, userId) {
    commit(GET_USER_BY_ID_REQUEST);
    try {
      const users = await getUserByIDAPI(userId);
      commit(GET_USER_BY_ID_SUCCESS, users);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      commit(GET_USER_BY_ID_FAILURE, error);
    }
  },
  async getUserByName({ commit }, firstName) {
    commit(GET_USER_BY_NAME_REQUEST);
    try {
      const user = await getUserByNameAPI(firstName);
      commit(GET_USER_BY_NAME_SUCCESS, user);
    } catch (error) {
      console.error("Error fetching user by name:", error);
      commit(GET_USER_BY_NAME_FAILURE, error);
    }
  },
  async getCurrentUser({ commit, state }) {
    if (!state.token) {
      return; // No token available, cannot fetch current user
    }
    commit(GET_CURRENT_USER_REQUEST);
    try {
      const user = await getCurrentUserAPI();
      commit(GET_CURRENT_USER_SUCCESS, user);
    } catch (error) {
      console.error("Error fetching current user:", error);
      commit(GET_CURRENT_USER_FAILURE, error);
    }
  },
  logout({ commit }) {
    commit("logout");
    router.push({ path: `/login` });
  },
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  token: (state) => state.token,
  user: (state) => state.user,
  loading: (state) => state.loading,
  error: (state) => state.error,
  users: (state) => state.users,
  currentUser: (state) => state.currentUser,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
