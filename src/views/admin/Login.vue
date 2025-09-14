<template>
  <div v-if="loading" class="bg-green-500 h-1.5 w-full animate-pulse"></div>

  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md">
      <div class="bg-gray-200 shadow-xl rounded-2xl px-8 pt-8 pb-10 mb-6">
        <!-- Header -->
        <div class="text-center mb-6">
          <h2 class="text-3xl font-extrabold text-gray-800">Login</h2>
          <p class="text-sm text-gray-500 mt-2">
            Welcome back! Please log in to continue.
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="performLogin">
          <!-- Username -->
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-semibold mb-2"
              for="username"
            >
              Username
            </label>
            <input
              v-model="username"
              type="text"
              id="username"
              placeholder="Enter your username"
              class="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-green-400 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <!-- Password -->
          <div class="mb-6">
            <label
              class="block text-gray-700 text-sm font-semibold mb-2"
              for="password"
            >
              Password
            </label>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="Enter your password"
              class="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:ring-2 focus:ring-green-400 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <!-- Submit -->
          <div class="flex items-center justify-center">
            <button
              type="submit"
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              :class="{ 'animate-pulse': loginAnimation }"
              @click="animateLogin"
            >
              Login
            </button>
          </div>

          <!-- Error Message -->
          <div
            v-if="error"
            class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
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
