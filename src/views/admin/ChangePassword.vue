<template>
  <div v-if="loading" class="bg-green-500 h-1.5 w-full animate-pulse"></div>

  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md">
      <div class="bg-white shadow-xl rounded-2xl px-8 pb-10 mb-6">
        <!-- Header -->
        <div class="text-center mb-6">
          <h2 class="text-3xl font-extrabold text-gray-800">Change Password</h2>
          <p class="text-sm text-gray-500 mt-2">
            Keep your account secure by updating your password.
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="performPasswordChange">
          <!-- Old Password -->
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-semibold mb-2"
              for="oldPassword"
            >
              Current Password
            </label>
            <input
              v-model="oldPassword"
              type="password"
              id="oldPassword"
              placeholder="Enter current password"
              class="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-green-400 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <!-- New Password -->
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-semibold mb-2"
              for="newPassword"
            >
              New Password
            </label>
            <input
              v-model="newPassword"
              type="password"
              id="newPassword"
              placeholder="Enter new password"
              class="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-green-400 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <!-- Confirm Password -->
          <div class="mb-6">
            <label
              class="block text-gray-700 text-sm font-semibold mb-2"
              for="confirmPassword"
            >
              Confirm New Password
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              class="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-green-400 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <!-- Submit -->
          <div class="flex items-center justify-center">
            <button
              type="submit"
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              :class="{ 'animate-pulse': changeAnimation }"
              @click="animateChange"
            >
              Update Password
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

          <!-- Success Message -->
          <div
            v-if="success"
            class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong class="font-bold">Success:</strong>
            <span class="block sm:inline">Password updated successfully!</span>
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
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      changeAnimation: false,
      success: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["loading", "error"]),
  },
  methods: {
    ...mapActions("auth", ["changePassword"]),

    async performPasswordChange() {
      // Reset success message
      this.success = false;

      if (this.newPassword !== this.confirmPassword) {
        // Handle password mismatch
        alert("New password and confirmation do not match!");
        return;
      }

      try {
        await this.changePassword({
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        });
        this.success = true;
        this.oldPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
      } catch (err) {
        console.error(err);
        // Error is automatically handled via Vuex getter
      }
    },

    animateChange() {
      this.changeAnimation = true;
      setTimeout(() => {
        this.changeAnimation = false;
      }, 1000);
    },
  },
};
</script>
