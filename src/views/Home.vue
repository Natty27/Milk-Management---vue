<template>
  <div v-if="loading" class="bg-green-500 h-1.5 w-full animate-pulse"></div>
  <div class="min-h-screen flex">
    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-y-auto">
      <!-- <Header @toggle-sidebar="toggleSidebar" /> -->
      <div class="p-4">
        <div class="grid grid-cols-1 gap-4">
          <div
            class="bg-white rounded-lg shadow-lg p-4 animate-slideIn animate-fadeIn"
          >
            <h2 class="text-xl font-bold">Dashboard Content</h2>
            <p>Welcome to your dashboard!</p>
          </div>
          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg shadow-lg p-4 text-center">
              <div class="flex items-center justify-center">
                <span class="mdi mdi-cow text-3xl"></span>
              </div>
              <h3 class="text-lg font-semibold mt-2">Total Cows</h3>
              <p>{{ cows.length }}</p>
            </div>
            <div class="bg-white rounded-lg shadow-lg p-4 text-center">
              <div class="flex items-center justify-center">
                <span class="mdi mdi-dns text-3xl"></span>
              </div>
              <h3 class="text-lg font-semibold mt-2">Categories</h3>
              <p>{{ categorys.length }}</p>
            </div>
            <div class="bg-white rounded-lg shadow-lg p-4 text-center">
              <div class="flex items-center justify-center">
                <span class="mdi mdi-cow text-3xl"></span>
              </div>
              <h3 class="text-lg font-semibold mt-2">Total Milking Records</h3>
              <p>{{ milkingRecords.length }}</p>
            </div>
            <div class="bg-white rounded-lg shadow-lg p-4 text-center">
              <div class="flex items-center justify-center">
                <span class="mdi mdi-school text-3xl"></span>
              </div>
              <h3 class="text-lg font-semibold mt-2">Cows</h3>
              <p>10</p>
            </div>
          </div>
          <!-- Charts -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BarChart />
            <PieChart />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/Header.vue";
import BarChart from "@/components/BarChart.vue";
import PieChart from "@/components/PieChart.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    Sidebar,
    Header,
    BarChart,
    PieChart,
  },
  data() {
    return {
      drawer: false,
      loading: true,
    };
  },
  created() {
    setTimeout(() => {
      this.loading = false;
      this.fetchCategorys();
      this.fetchCows();
      this.fetchMilkingRecords();
    }, 1000);
  },
  computed: {
    ...mapGetters("category", ["categorys"]),
    ...mapGetters("cow", ["cows"]),
    ...mapGetters("milkingRecord", ["milkingRecords"]),
  },
  methods: {
    ...mapActions("category", ["getAllCategorys"]),
    ...mapActions("cow", ["getAllCows"]),
    ...mapActions("milkingRecord", ["getAllMilkingRecords"]),
    fetchCategorys() {
      this.getAllCategorys();
    },
    fetchCows() {
      this.getAllCows();
    },
    fetchMilkingRecords() {
      this.getAllMilkingRecords();
    },
    toggleSidebar() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slideIn {
  0% {
    transform: translateX(-30px);
  }
  100% {
    transform: translateX(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 2s ease-in-out;
}

.animate-slideIn {
  animation: slideIn 1s ease-in-out;
}
</style>
