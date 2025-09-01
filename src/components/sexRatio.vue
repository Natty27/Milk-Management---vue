<template>
    <v-card>
      <v-card-title>Sex Ratio</v-card-title>
      <v-card-text>
        <canvas id="sex-ratio"></canvas>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
  
  Chart.register(PieController, ArcElement, Tooltip, Legend);
  
  export default {
    mounted() {
      new Chart(document.getElementById('sex-ratio'), {
        type: 'pie',
        data: {
          labels: ['Female', 'Male'],
          datasets: [
            {
              label: 'sexRatio',
              backgroundColor: ['#FF6384', '#36A2EB'],
              data: [30, 50],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
  };
  </script>
  
  <style scoped>
  .v-card {
    margin-top: 20px;
    height: 400px;
  }
  canvas {
    max-width: 100%;
  }
  </style>
  