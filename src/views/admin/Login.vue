<template>
  <div v-if="loading" class="bg-green-500 h-1.5 w-full animate-pulse"></div>

  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md">
      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
        <form @submit.prevent="performLogin">
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="username"
            >
              Username
            </label>
            <input
              v-model="username"
              type="username"
              id="username"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div class="mb-6">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="password"
            >
              Password
            </label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div class="flex items-center justify-center">
            <button
              type="submit"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              :class="{ 'animate-pulse': loginAnimation }"
              @click="animateLogin"
            >
              Login
            </button>
          </div>
          <div
            v-if="error"
            class="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong class="font-bold">Error:</strong>
            <span class="block sm:inline">{{ error.message }}</span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      username: "",
      password: "",
      loginAnimation: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["loading", "error"]),
  },
  methods: {
    ...mapActions("auth", ["login"]),
    performLogin() {
      this.login({ username: this.username, password: this.password });
    },
    animateLogin() {
      this.loginAnimation = true;
      setTimeout(() => {
        this.loginAnimation = false;
      }, 1000);
    },
  },
};
</script>
