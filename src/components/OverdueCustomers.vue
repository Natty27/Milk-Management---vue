<template>
  <div
    v-if="overdueCustomers && overdueCustomers.length > 0"
    class="max-w-7xl mx-auto mb-8"
  >
    <div class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0">
          <svg
            class="h-6 w-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-semibold text-red-800">
            Overdue Customers Alert
          </h3>
          <p class="text-sm text-red-700">
            {{ overdueCustomers.length }} customer{{
              overdueCustomers.length > 1 ? "s" : ""
            }}
            have overdue payments
          </p>
        </div>
      </div>

      <!-- Overdue Customers List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="customer in overdueCustomers"
          :key="customer._id"
          class="bg-white rounded-lg border border-red-200 p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="text-sm font-semibold text-gray-900 mb-1">
                {{ customer.name }}
              </h4>
              <div class="space-y-1 text-xs text-gray-600">
                <p>
                  <span class="font-medium">Amount:</span>
                  ${{ customer.amount.toLocaleString() }}
                </p>
                <p>
                  <span class="font-medium">Type:</span>
                  <span class="capitalize">{{ customer.type }}</span>
                </p>
                <p>
                  <span class="font-medium">Due Day:</span>
                  {{ customer.monthlyDueDay }}
                </p>
                <p v-if="customer.lastPaymentDate">
                  <span class="font-medium">Last Payment:</span>
                  {{ $toEthiopianString(customer.lastPaymentDate) }}
                </p>
                <p v-if="customer.address">
                  <span class="font-medium">Address:</span>
                  {{ customer.address }}
                </p>
              </div>
            </div>
            <div class="ml-3">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
              >
                Overdue
              </span>
            </div>
          </div>

          <!-- Days Overdue Calculation -->
          <div class="mt-3 pt-3 border-t border-gray-100">
            <p class="text-xs text-red-600 font-medium">
              {{ getDaysOverdue(customer) }} day{{
                getDaysOverdue(customer) !== 1 ? "s" : ""
              }}
              overdue
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex flex-wrap gap-3">
        <button
          @click="$emit('viewAllCustomers')"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          <svg
            class="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          View All Customers
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OverdueCustomers",
  props: {
    overdueCustomers: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["viewAllCustomers", "sendReminders"],
  methods: {
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    getDaysOverdue(customer) {
      if (!customer.lastPaymentDate) {
        // If no last payment date, calculate from due day of current month
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const dueDate = new Date(
          currentYear,
          currentMonth,
          customer.monthlyDueDay
        );

        // If due date has passed this month
        if (dueDate < today) {
          return Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
        }

        // If due date hasn't passed this month, check previous month
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const prevDueDate = new Date(
          prevYear,
          prevMonth,
          customer.monthlyDueDay
        );
        return Math.ceil((today - prevDueDate) / (1000 * 60 * 60 * 24));
      }

      const lastPayment = new Date(customer.lastPaymentDate);
      const today = new Date();
      return Math.ceil((today - lastPayment) / (1000 * 60 * 60 * 24));
    },
  },
};
</script>

<style scoped>
/* Custom styles for the component */
</style>


