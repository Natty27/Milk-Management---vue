<template>
  <div class="bg-white rounded-lg shadow-lg p-4 mt-5 chart-card">
    <h2 class="text-lg font-bold mb-2">Books</h2>
    <div class="relative h-96">
      <canvas id="bar-chart"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ctx = document.getElementById('bar-chart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'Average',
              backgroundColor: '#42A5F5',
              borderColor: '#1E88E5',
              borderWidth: 2,
              data: [40, 39, 10, 40, 39, 80, 40],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 2000,
            easing: 'easeInOutQuart',
            onComplete: function () {
              // Animation complete callback (if needed)
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: '#333',
                font: {
                  size: 12,
                },
              },
            },
            y: {
              grid: {
                color: '#eee',
                lineWidth: 1,
              },
              ticks: {
                color: '#333',
                font: {
                  size: 12,
                },
              },
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.chart-card {
  animation: fadeIn 1s ease-in-out, slideIn 1s ease-in-out;
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
    transform: translateY(-30px);
  }
  100% {
    transform: translateY(0);
  }
}

canvas {
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  max-height: none !important;
}
</style>
