<template>
  <v-app>
    <Sidebar />

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-card class="dashboard-card" elevation="10">
              <v-card-title>Course Content</v-card-title>
              <v-card-text>
                Welcome to your animated dashboard!
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
export default {
  components:{
    'Sidebar': Sidebar
  },
  data() {
    return {
      drawer: true,
      miniVariant: false,
      clipped: false,
    };
  },
};
</script>

<style scoped>
.dashboard-card {
  animation: slideIn 1s ease-in-out, fadeIn 2s ease-in-out;
  max-width: 100%;
  margin-top: 50px;
}

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
</style>
