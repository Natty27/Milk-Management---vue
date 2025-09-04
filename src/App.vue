<script setup>
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import { useStore } from "vuex";
import Sidebar from "./components/Sidebar.vue";
import Header from "./components/Header.vue";

const route = useRoute();
const store = useStore();

// Check if user is authenticated using your existing getter
const isAuthenticated = computed(() => store.getters["auth/isAuthenticated"]);

// Check if current route is login or register page (public routes)
const isPublicRoute = computed(() => {
  return (
    route.name === "login" || route.name === "register" || route.name === "404"
  );
});

// Only show sidebar and header if authenticated AND not on public routes
const showLayout = computed(() => {
  return isAuthenticated.value && !isPublicRoute.value;
});
</script>

<template>
  <div v-if="showLayout" class="flex min-h-screen bg-gray-50">
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

  <!-- Simple layout for public pages (login, register, 404) -->
  <div v-else class="min-h-screen bg-gray-50">
    <RouterView />
  </div>
</template>
