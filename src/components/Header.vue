<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
    <div class="flex items-center justify-between h-16 px-4 md:px-6">
      <!-- Left side - Empty space for mobile (balances toggle button) -->
      <div class="w-12 md:w-0"></div>

      <!-- Center content -->
      <!-- <h1 class="text-xl font-semibold text-gray-800 mx-auto md:mx-0">
        Cattle Management System
      </h1> -->

      <!-- Right side controls -->
      <div class="flex items-center space-x-4">
        <button class="p-1 text-gray-500 hover:text-gray-700">
          <i class="mdi mdi-bell-outline text-2xl"></i>
        </button>
        <div class="flex items-center space-x-2">
          <div
            class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium"
          >
            {{ userInitial }}
          </div>
          <span class="hidden md:inline">{{ userName }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";

const userName = "User Name";
const userInitial = computed(() => userName.charAt(0).toUpperCase());
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
