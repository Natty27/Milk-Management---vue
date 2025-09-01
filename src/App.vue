<script setup>
import { RouterView } from "vue-router";
import Sidebar from "./components/Sidebar.vue";
import Header from "./components/Header.vue";
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col md:ml-64">
      <!-- Only apply ml on desktop -->
      <!-- Header -->
      <Header />

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-white">
        <RouterView />
      </main>
    </div>
  </div>
</template>
