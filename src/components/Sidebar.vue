<template>
  <!-- Mobile Toggle Button -->
  <button
    @click="toggleSidebar"
    class="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-200 text-gray-600"
  >
    <i class="mdi mdi-menu text-2xl"></i>
  </button>

  <!-- Sidebar -->
  <div
    ref="sidebar"
    class="w-64 h-screen bg-gray-50 shadow-md flex flex-col transition-all duration-300 fixed md:fixed md:left-0"
    :class="{
      'translate-x-0': isOpen,
      '-translate-x-full md:translate-x-0': !isOpen,
    }"
  >
    <!-- Sidebar Header -->
    <div class="p-5 border-b border-gray-200 text-center">
      <h2 class="text-xl font-semibold text-gray-800 m-0">My App</h2>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 p-2 overflow-y-auto">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center p-3 mx-2 my-1 text-gray-600 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200"
        active-class="bg-blue-100 text-blue-600"
        @click="closeSidebarOnMobile"
      >
        <i :class="`${item.icon} mr-4 text-lg`"></i>
        <span class="text-sm font-medium">{{ item.title }}</span>
      </RouterLink>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center mb-3 p-2 rounded-lg">
        <i class="mdi mdi-account-circle text-gray-500 text-2xl mr-3"></i>
        <span class="text-gray-800 text-sm">{{
          user?.name || "User Name"
        }}</span>
      </div>
      <button
        @click="logoutHandler"
        class="flex items-center w-full p-2 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-200"
      >
        <i class="mdi mdi-logout mr-3 text-lg"></i>
        <span class="text-sm font-medium">Logout</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Sidebar",
  data() {
    return {
      menuItems: [
        { title: "Dashboard", path: "/", icon: "mdi mdi-view-dashboard" },
        { title: "Cattle", path: "/cows", icon: "mdi mdi-cow" },
        {
          title: "Customers",
          path: "/customers",
          icon: "mdi mdi-account-multiple",
        },
        {
          title: "Milking Records",
          path: "/milkingRecords",
          icon: "mdi mdi-cow",
        },
        {
          title: "Expenses",
          path: "/expenses",
          icon: "mdi mdi-cash",
        },
        {
          title: "Sales",
          path: "/sales",
          icon: "mdi mdi-cash",
        },
        { title: "Settings", path: "/settings", icon: "mdi mdi-cog" },
        { title: "Calendar", path: "/calendar", icon: "mdi mdi-calendar" },
        { title: "Files", path: "/files", icon: "mdi mdi-folder" },
        { title: "Analytics", path: "/analytics", icon: "mdi mdi-chart-bar" },
      ],
      isOpen: false,
    };
  },

  computed: {
    ...mapGetters("auth", ["user"]),
  },

  methods: {
    ...mapActions("auth", ["logout", "getCurrentUser"]),

    logoutHandler() {
      this.logout();
    },

    toggleSidebar() {
      this.isOpen = !this.isOpen;
    },

    closeSidebarOnMobile() {
      if (window.innerWidth < 768) {
        // md breakpoint
        this.isOpen = false;
      }
    },

    handleResize() {
      if (window.innerWidth >= 768) {
        // md breakpoint
        this.isOpen = true;
      }
    },
  },

  created() {
    this.getCurrentUser();
    this.handleResize(); // Set initial state based on screen size
    window.addEventListener("resize", this.handleResize);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
/* Ensure smooth transitions */
.fixed {
  transition: transform 0.3s ease;
}
</style>
