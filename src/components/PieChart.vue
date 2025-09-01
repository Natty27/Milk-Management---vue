<template>
  <div class="bg-white rounded-lg shadow-lg p-4 mt-5">
    <h2 class="text-lg font-bold mb-2">Books by Categories</h2>
    <div class="relative h-96">
      <canvas id="pie-chart" class="w-full h-full"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import { mapActions, mapGetters } from 'vuex';

Chart.register(PieController, ArcElement, Tooltip, Legend);

export default {
  data() {
    return {
      chart: null,
    };
  },

  computed: {
    ...mapGetters('category', ['loading', 'categorys']),
  },

  methods: {
    ...mapActions('category', ['getAllCategorys']),

    fetchCategorys() {
      this.getAllCategorys();
    },

    renderChart() {
      if (this.loading) {
        console.log('Data is still loading...');
        return;
      }

      if (!this.categorys || this.categorys.length === 0) {
        console.error('No category data available.');
        return;
      }

      const ctx = document.getElementById('pie-chart').getContext('2d');

      if (!ctx) {
        console.error('Failed to get the canvas context.');
        return;
      }

      if (this.chart) {
        this.chart.destroy();
      }

      // Extract labels and data from the categorys array
      const labels = this.categorys.map(cat => cat.categoryName);
      const data = this.categorys.map(cat => cat.bookCount || 0); // Ensure bookCount is available

      console.log('Labels:', labels);
      console.log('Data:', data);

      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Number of Books per Category',
              backgroundColor: this.categorys.map((_, index) =>
                `hsl(${(index * 360) / this.categorys.length}, 70%, 70%)` // Generate distinct colors
              ),
              data: data,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`; // Display value in tooltip
                },
              },
            },
          },
        },
      });
    },
  },

  watch: {
    categorys(newVal) {
      this.renderChart(); // Re-render chart when categorys data changes
    },
  },

  created() {
    this.fetchCategorys();
  },
};
</script>

<style scoped>
canvas {
  max-width: 100%;
}
</style>
