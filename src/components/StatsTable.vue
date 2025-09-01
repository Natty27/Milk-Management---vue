<template>
    <v-card class="stats-card">
      <v-card-title>Statistics Table</v-card-title>
      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Statistic</th>
                <th class="text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(stat, index) in stats" :key="index">
                <td>{{ stat.label }}</td>
                <td class="text-right">{{ stat.value }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  export default {
    data() {
      return {
        stats: [
          { label: 'Total Users', value: 100 },
          { label: 'Active Users', value: 80 },
          { label: 'Inactive Users', value: 20 },
          { label: 'New Users (Today)', value: 5 },
          { label: 'Revenue (Last Month)', value: '$10,000' },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .stats-card {
    margin-top: 20px;
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
  
  .text-left {
    text-align: left;
  }
  
  .text-right {
    text-align: right;
  }
  </style>
  