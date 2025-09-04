<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Farm Reports Dashboard
      </h1>
      <p class="text-gray-600">
        Comprehensive analytics for your farm management
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto">
      <div class="flex justify-center items-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
        ></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="max-w-7xl mx-auto mb-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Date Range Selector (Always visible) -->
    <div class="max-w-7xl mx-auto mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Select Date Range
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Start Date</label
            >
            <input
              type="date"
              v-model="startDate"
              @change="applyDateFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >End Date</label
            >
            <input
              type="date"
              v-model="endDate"
              @change="applyDateFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="range in quickRanges"
            :key="range.label"
            @click="setQuickRange(range)"
            :class="[
              'px-3 py-2 text-sm rounded-md transition-colors',
              isActiveRange(range)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
          >
            {{ range.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Report Type Selector -->
    <div class="max-w-7xl mx-auto mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Select Report Type
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            v-for="reportType in reportTypes"
            :key="reportType.value"
            @click="loadReport(reportType.value)"
            :class="[
              'px-4 py-3 rounded-lg border transition-colors',
              currentReportType === reportType.value
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-gray-50',
            ]"
          >
            <component :is="reportType.icon" class="h-6 w-6 mx-auto mb-2" />
            <span class="text-sm font-medium">{{ reportType.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Cow Selector (for production reports) -->
    <div
      v-if="currentReportType === 'cowProduction'"
      class="max-w-7xl mx-auto mb-8"
    >
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Select Cow</h2>
        <select
          v-model="selectedCowId"
          @change="applyCowFilter"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Cows</option>
          <option v-for="cow in cows" :key="cow.id" :value="cow.id">
            {{ cow.name }} ({{ cow.breed }})
          </option>
        </select>
      </div>
    </div>

    <!-- Report Content -->
    <div class="max-w-7xl mx-auto">
      <!-- Dashboard Summary -->
      <div
        v-if="currentReportType === 'dashboard' && dashboardSummary"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <div
          v-for="stat in dashboardStats"
          :key="stat.label"
          class="bg-white rounded-lg shadow p-6"
        >
          <div class="flex items-center">
            <div :class="['p-3 rounded-lg', stat.bgColor]">
              <component :is="stat.icon" class="h-6 w-6 text-white" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Expense Report -->
      <div
        v-if="currentReportType === 'expense' && expenseReport"
        class="space-y-6"
      >
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Expense Summary
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">
                Total Expenses
              </h3>
              <p class="text-3xl font-bold text-red-600">
                ${{ expenseReport.totalExpenses.toLocaleString() }}
              </p>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">
                By Category
              </h3>
              <div
                v-for="item in expenseReport.byCategory"
                :key="item.category"
                class="flex justify-between mb-2"
              >
                <span class="text-gray-600 capitalize">{{
                  item.category
                }}</span>
                <span class="font-medium"
                  >${{ item.total.toLocaleString() }}</span
                >
              </div>
            </div>
          </div>
          <div v-if="expensePieChartData" class="mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-3">
              Category Breakdown
            </h3>
            <div class="h-72">
              <Pie
                :data="expensePieChartData.data"
                :options="expensePieChartData.options"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Report -->
      <div
        v-if="currentReportType === 'revenue' && revenueReport"
        class="space-y-6"
      >
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Revenue Summary
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">
                Total Revenue
              </h3>
              <p class="text-3xl font-bold text-green-600">
                ${{ revenueReport.totalRevenue.toLocaleString() }}
              </p>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">By Product</h3>
              <div
                v-for="item in revenueReport.byProduct"
                :key="item.product"
                class="flex justify-between mb-2"
              >
                <span class="text-gray-600 capitalize">{{ item.product }}</span>
                <span class="font-medium"
                  >${{ item.total.toLocaleString() }}</span
                >
              </div>
            </div>
          </div>
          <div v-if="revenueBarChartData" class="mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-3">
              Revenue by Product
            </h3>
            <div class="h-72">
              <Bar
                :data="revenueBarChartData.data"
                :options="revenueBarChartData.options"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Profit/Loss Report -->
      <div
        v-if="currentReportType === 'profitLoss' && profitLossReport"
        class="space-y-6"
      >
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Profit & Loss Statement
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Revenue</h3>
              <p class="text-2xl font-bold text-green-600">
                ${{ profitLossReport.totalRevenue.toLocaleString() }}
              </p>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Expenses</h3>
              <p class="text-2xl font-bold text-red-600">
                ${{ profitLossReport.totalExpenses.toLocaleString() }}
              </p>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Net Profit</h3>
              <p
                :class="[
                  'text-2xl font-bold',
                  profitLossReport.netProfit >= 0
                    ? 'text-green-600'
                    : 'text-red-600',
                ]"
              >
                ${{ profitLossReport.netProfit.toLocaleString() }}
              </p>
              <p class="text-sm text-gray-600">
                Margin: {{ profitLossReport.profitMargin.toFixed(2) }}%
              </p>
            </div>
          </div>
          <div v-if="profitVsExpenseBarChartData" class="mt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-3">
              Revenue vs Expenses
            </h3>
            <div class="h-72">
              <Bar
                :data="profitVsExpenseBarChartData.data"
                :options="profitVsExpenseBarChartData.options"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Cow Production Report -->
      <div
        v-if="currentReportType === 'cowProduction' && cowProductionReport"
        class="space-y-6"
      >
        <div v-if="cowAvgDailyLineData" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Production Overview
          </h2>
          <div class="h-72">
            <Line
              :data="cowAvgDailyLineData.data"
              :options="cowAvgDailyLineData.options"
            />
          </div>
        </div>
        <div
          v-for="cow in cowProductionReport"
          :key="cow.cowId"
          class="bg-white rounded-lg shadow p-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            {{ cow.cowName }} - Production Report
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">
                Production Summary
              </h3>
              <div class="space-y-2">
                <p>
                  <span class="font-medium">Total Milk:</span>
                  {{ cow.totalMilk }}L
                </p>
                <p>
                  <span class="font-medium">Average Daily:</span>
                  {{ cow.averageDaily.toFixed(2) }}L
                </p>
                <p>
                  <span class="font-medium">Average Fat:</span>
                  {{ cow.averageFat.toFixed(2) }}%
                </p>
                <p>
                  <span class="font-medium">Average SNF:</span>
                  {{ cow.averageSNF.toFixed(2) }}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Customer Report -->
      <div
        v-if="currentReportType === 'customer' && customerReport"
        class="space-y-6"
      >
        <div
          v-for="customer in customerReport"
          :key="customer.customerId"
          class="bg-white rounded-lg shadow p-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            {{ customer.customerName }} - Customer Analysis
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">
                Purchase Summary
              </h3>
              <div class="space-y-2">
                <p>
                  <span class="font-medium">Total Purchases:</span> ${{
                    customer.totalPurchases.toLocaleString()
                  }}
                </p>
                <p>
                  <span class="font-medium">Average Purchase:</span> ${{
                    customer.averagePurchase.toLocaleString()
                  }}
                </p>
                <p>
                  <span class="font-medium">Favorite Product:</span>
                  {{ customer.favoriteProduct }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Health Report -->
      <div
        v-if="currentReportType === 'health' && healthReport"
        class="space-y-6"
      >
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            System Health Report
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">
                System Statistics
              </h3>
              <div class="space-y-2">
                <p>
                  <span class="font-medium">Total Cows:</span>
                  {{ healthReport.totalCows }}
                </p>
                <p>
                  <span class="font-medium">Total Customers:</span>
                  {{ healthReport.totalCustomers }}
                </p>
                <p>
                  <span class="font-medium">Total Sales:</span>
                  {{ healthReport.totalSales }}
                </p>
                <p>
                  <span class="font-medium">Total Expenses:</span>
                  {{ healthReport.totalExpenses }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!currentReportType && !loading"
        class="bg-white rounded-lg shadow p-12 text-center"
      >
        <svg
          class="h-12 w-12 text-gray-400 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          No Report Selected
        </h3>
        <p class="text-gray-600">
          Choose a report type from above to view analytics
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Pie, Bar, Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  HomeIcon,
  HeartIcon,
} from "@heroicons/vue/24/outline";

// Custom cow icon since Heroicons doesn't have one
const CowIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  `,
};

export default {
  name: "ReportsDashboard",

  components: {
    Pie,
    Bar,
    Line,
    ChartBarIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    UserGroupIcon,
    HomeIcon,
    HeartIcon,
    CowIcon,
  },

  data() {
    return {
      startDate: "",
      endDate: "",
      selectedCowId: "",
      currentRange: null,
      reportTypes: [
        { value: "dashboard", label: "Dashboard", icon: "HomeIcon" },
        { value: "expense", label: "Expenses", icon: "CurrencyDollarIcon" },
        { value: "revenue", label: "Revenue", icon: "ArrowTrendingUpIcon" },
        { value: "profitLoss", label: "Profit/Loss", icon: "ChartBarIcon" },
        { value: "cowProduction", label: "Production", icon: "CowIcon" },
        { value: "customer", label: "Customers", icon: "UserGroupIcon" },
        { value: "health", label: "System Health", icon: "HeartIcon" },
      ],
      quickRanges: [
        { label: "Today", days: 0, value: "today" },
        { label: "Last 7 Days", days: 7, value: "last7" },
        { label: "Last 30 Days", days: 30, value: "last30" },
        { label: "This Month", days: "month", value: "month" },
        { label: "This Year", days: "year", value: "year" },
      ],
    };
  },

  computed: {
    ...mapGetters("report", [
      "loading",
      "error",
      "expenseReport",
      "revenueReport",
      "profitLossReport",
      "cowProductionReport",
      "customerReport",
      "dashboardSummary",
      "healthReport",
      "currentReportType",
    ]),
    ...mapGetters("cow", ["cows"]),

    dashboardStats() {
      if (!this.dashboardSummary) return [];

      return [
        {
          label: "Total Cows",
          value: this.dashboardSummary.totals.cows,
          icon: "CowIcon",
          bgColor: "bg-blue-500",
        },
        {
          label: "Total Customers",
          value: this.dashboardSummary.totals.customers,
          icon: "UserGroupIcon",
          bgColor: "bg-green-500",
        },
        {
          label: "Monthly Revenue",
          value: `$${this.dashboardSummary.totals.monthlyRevenue.toLocaleString()}`,
          icon: "CurrencyDollarIcon",
          bgColor: "bg-purple-500",
        },
        {
          label: "Today's Milk",
          value: `${this.dashboardSummary.totals.todayMilk}L`,
          icon: "ArrowTrendingUpIcon",
          bgColor: "bg-orange-500",
        },
      ];
    },

    expensePieChartData() {
      if (!this.expenseReport || !this.expenseReport.byCategory) return null;
      const labels = this.expenseReport.byCategory.map((c) => c.category);
      const values = this.expenseReport.byCategory.map((c) => c.total);
      const colors = [
        "#3b82f6",
        "#22c55e",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
        "#84cc16",
        "#f97316",
      ];
      return {
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: labels.map((_, i) => colors[i % colors.length]),
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" },
            title: { display: false },
          },
        },
      };
    },

    revenueBarChartData() {
      if (!this.revenueReport || !this.revenueReport.byProduct) return null;
      const labels = this.revenueReport.byProduct.map((p) => p.product);
      const values = this.revenueReport.byProduct.map((p) => p.total);
      return {
        data: {
          labels,
          datasets: [
            {
              label: "Revenue",
              data: values,
              backgroundColor: "#10b981",
              borderRadius: 6,
              maxBarThickness: 40,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: { grid: { display: false } },
            y: {
              grid: { color: "#f3f4f6" },
              ticks: { callback: (v) => `$${v}` },
            },
          },
        },
      };
    },

    profitVsExpenseBarChartData() {
      if (!this.profitLossReport) return null;
      const labels = ["Revenue", "Expenses", "Net Profit"];
      const values = [
        this.profitLossReport.totalRevenue || 0,
        this.profitLossReport.totalExpenses || 0,
        this.profitLossReport.netProfit || 0,
      ];
      const colors = ["#16a34a", "#ef4444", "#3b82f6"];
      return {
        data: {
          labels,
          datasets: [
            {
              label: "Amount",
              data: values,
              backgroundColor: labels.map((_, i) => colors[i % colors.length]),
              borderRadius: 6,
              maxBarThickness: 50,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false } },
            y: {
              grid: { color: "#f3f4f6" },
              ticks: { callback: (v) => `$${v}` },
            },
          },
        },
      };
    },

    cowAvgDailyLineData() {
      if (!this.cowProductionReport || !Array.isArray(this.cowProductionReport))
        return null;
      const labels = this.cowProductionReport.map((c) => c.cowName);
      const values = this.cowProductionReport.map((c) =>
        Number(c.averageDaily || 0)
      );
      return {
        data: {
          labels,
          datasets: [
            {
              label: "Avg Daily Milk (L)",
              data: values,
              borderColor: "#2563eb",
              backgroundColor: "rgba(37, 99, 235, 0.25)",
              pointBackgroundColor: "#2563eb",
              pointRadius: 4,
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: true, position: "bottom" } },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { color: "#f3f4f6" } },
          },
        },
      };
    },
  },

  methods: {
    ...mapActions("report", [
      "getExpenseReport",
      "getRevenueReport",
      "getProfitLossReport",
      "getCowProductionReport",
      "getCustomerReport",
      "getDashboardSummary",
      "getHealthReport",
      "clearError",
    ]),
    ...mapActions("cow", ["getAllCows"]),

    isActiveRange(range) {
      return this.currentRange === range.value;
    },

    async loadReport(reportType) {
      this.clearError();
      await this.applyFilters(reportType);
    },

    async applyFilters(reportType = this.currentReportType) {
      if (!reportType) return;

      const params = {};
      if (this.startDate) params.startDate = this.startDate;
      if (this.endDate) params.endDate = this.endDate;
      if (this.selectedCowId && reportType === "cowProduction")
        params.cowId = this.selectedCowId;

      try {
        switch (reportType) {
          case "dashboard":
            await this.getDashboardSummary();
            break;
          case "expense":
            await this.getExpenseReport(params);
            break;
          case "revenue":
            await this.getRevenueReport(params);
            break;
          case "profitLoss":
            await this.getProfitLossReport(params);
            break;
          case "cowProduction":
            await this.getCowProductionReport(params);
            break;
          case "customer":
            await this.getCustomerReport(params);
            break;
          case "health":
            await this.getHealthReport();
            break;
        }
      } catch (error) {
        console.error("Failed to load report:", error);
      }
    },

    async applyDateFilter() {
      this.currentRange = null;
      await this.applyFilters();
    },

    async applyCowFilter() {
      if (this.currentReportType === "cowProduction") {
        await this.applyFilters();
      }
    },

    async setQuickRange(range) {
      const today = new Date();
      const start = new Date();

      if (range.days === "month") {
        start.setDate(1);
        this.endDate = today.toISOString().split("T")[0];
        this.startDate = start.toISOString().split("T")[0];
      } else if (range.days === "year") {
        start.setMonth(0, 1);
        this.endDate = today.toISOString().split("T")[0];
        this.startDate = start.toISOString().split("T")[0];
      } else {
        start.setDate(today.getDate() - range.days);
        this.endDate = today.toISOString().split("T")[0];
        this.startDate = start.toISOString().split("T")[0];
      }

      this.currentRange = range.value;
      await this.applyFilters();
    },
  },

  async mounted() {
    await this.getAllCows();
    // Set default range to current month
    this.setQuickRange({ days: "month", value: "month" });
    // Load dashboard by default
    await this.loadReport("dashboard");
  },
};
</script>

<style scoped>
/* Custom styles can be added here */
</style>
