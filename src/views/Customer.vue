<template>
  <v-progress-linear
    color="deep-purple-accent-4"
    indeterminate
    height="4"
    v-if="loading"
  ></v-progress-linear>

  <div class="min-h-screen flex bg-gray-50">
    <div class="flex flex-col flex-1 overflow-y-auto">
      <v-card flat class="rounded-lg shadow-sm border">
        <v-data-table
          :headers="headers"
          :items="customers"
          :search="search"
          :sort-by="[{ key: 'title', order: 'asc' }]"
          class="elevation-0"
          :header-props="{
            sortByText: 'Sort',
            style: {
              fontWeight: 'bold',
              fontSize: '14px',
            },
          }"
        >
          <!-- Toolbar and Dialogs -->
          <template v-slot:top>
            <v-toolbar flat class="px-4 py-3 bg-white rounded-t-lg">
              <v-toolbar-title class="text-xl font-semibold text-gray-800">
                <v-icon class="mr-2" color="deep-purple-accent-4"
                  >mdi-account</v-icon
                >
                Customers
              </v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                label="Search ..."
                prepend-inner-icon="mdi-magnify"
                clearable
                single-line
                variant="outlined"
                density="comfortable"
                hide-details
                class="w-64"
              ></v-text-field>
              <!-- Add Customer Dialog -->
              <v-dialog v-model="dialogAdd" max-width="600px">
                <template v-slot:activator="{ props }">
                  <v-btn
                    class="ml-4"
                    color="deep-purple-accent-4"
                    dark
                    prepend-icon="mdi-plus"
                    variant="elevated"
                    v-bind="props"
                  >
                    Add Customer
                  </v-btn>
                </template>

                <v-card
                  class="w-full max-w-md sm:max-w-lg md:max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden"
                >
                  <!-- Header -->
                  <div
                    class="bg-gradient-to-r from-deep-purple-accent-4 to-purple-600 p-4 text-black"
                  >
                    <div class="flex justify-between items-center">
                      <h2 class="text-xl font-semibold">Add New Customer</h2>
                      <v-btn
                        icon
                        @click="closeAdd"
                        variant="text"
                        color="white"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </div>
                  </div>

                  <!-- Scrollable Form Section -->
                  <div class="p-6 max-h-[80vh] overflow-y-auto">
                    <v-form @submit.prevent="save(editedItem)">
                      <!-- Add Customer Form Fields -->
                      <div class="space-y-4">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Name *"
                          variant="outlined"
                          density="comfortable"
                          type="text"
                          required
                        ></v-text-field>

                        <v-text-field
                          v-model="editedItem.amount"
                          label="Payment Amount (ETB) *"
                          variant="outlined"
                          density="comfortable"
                          type="number"
                          required
                        ></v-text-field>

                        <v-select
                          v-model="editedItem.type"
                          :items="options"
                          item-title="text"
                          item-value="value"
                          label="Type *"
                          variant="outlined"
                          density="comfortable"
                          required
                        ></v-select>

                        <v-text-field
                          v-if="editedItem.type === 'contract'"
                          v-model="editedItem.monthlyDueDay"
                          label="Due Day *"
                          variant="outlined"
                          density="comfortable"
                          type="number"
                          required
                        ></v-text-field>

                        <!-- Ethiopian Date Picker -->
                        <EthiopianDatePicker
                          v-if="editedItem.type === 'contract'"
                          v-model="editedItem.lastPaymentDate"
                          label="Last Payment Date"
                        />

                        <v-text-field
                          v-model="editedItem.address"
                          label="Address *"
                          variant="outlined"
                          density="comfortable"
                          required
                        ></v-text-field>
                      </div>

                      <!-- Actions -->
                      <div class="flex justify-end space-x-3 mt-6">
                        <v-btn
                          @click="closeAdd"
                          variant="outlined"
                          color="grey-darken-1"
                        >
                          Cancel
                        </v-btn>
                        <v-btn
                          type="submit"
                          color="deep-purple-accent-4"
                          variant="elevated"
                        >
                          Add Customer
                        </v-btn>
                      </div>
                    </v-form>
                  </div>
                </v-card>
              </v-dialog>

              <!-- Edit Cattle Dialog -->
              <v-dialog v-model="dialogEdit" max-width="600px">
                <v-card>
                  <div
                    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm"
                  >
                    <div
                      class="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md"
                    >
                      <div
                        class="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white"
                      >
                        <div class="flex justify-between items-center">
                          <h2 class="text-xl font-semibold">Edit Details</h2>
                          <v-btn
                            icon
                            @click="closeEdit"
                            variant="text"
                            color="white"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </div>
                      </div>
                      <div class="p-6">
                        <v-form @submit.prevent="updateItem(editedItem)">
                          <!-- Edit Cattle Form Fields -->
                          <div class="space-y-4">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Name *"
                              variant="outlined"
                              density="comfortable"
                              type="text"
                              required
                            ></v-text-field>

                            <v-text-field
                              v-model="editedItem.amount"
                              label="Payment Amount (ETB) *"
                              variant="outlined"
                              density="comfortable"
                              type="number"
                              required
                            ></v-text-field>

                            <v-select
                              v-model="editedItem.type"
                              :items="options"
                              item-title="text"
                              item-value="value"
                              label="Type *"
                              variant="outlined"
                              density="comfortable"
                              required
                            ></v-select>

                            <v-select
                              v-model="editedItem.status"
                              :items="statusOptions"
                              item-title="text"
                              item-value="value"
                              label="Status *"
                              variant="outlined"
                              density="comfortable"
                              required
                            ></v-select>

                            <v-text-field
                              v-if="editedItem.type === 'contract'"
                              v-model="editedItem.monthlyDueDay"
                              label="Due Day *"
                              variant="outlined"
                              density="comfortable"
                              type="number"
                              required
                            ></v-text-field>

                            <!-- Ethiopian Date Picker -->
                            <EthiopianDatePicker
                              v-if="editedItem.type === 'contract'"
                              v-model="editedItem.lastPaymentDate"
                              label="Last Payment Date"
                            />

                            <v-text-field
                              v-model="editedItem.address"
                              label="Address *"
                              variant="outlined"
                              density="comfortable"
                              required
                            ></v-text-field>
                          </div>
                          <div class="flex justify-end space-x-3 mt-6">
                            <v-btn
                              @click="closeEdit"
                              variant="outlined"
                              color="grey-darken-1"
                            >
                              Cancel
                            </v-btn>
                            <v-btn
                              type="submit"
                              color="blue-darken-2"
                              variant="elevated"
                            >
                              Update
                            </v-btn>
                          </div>
                        </v-form>
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-dialog>

              <!-- Edit Cattle Dialog -->
              <v-dialog v-model="dialogProcess" max-width="600px">
                <v-card>
                  <div
                    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm"
                  >
                    <div
                      class="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md"
                    >
                      <div
                        class="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white"
                      >
                        <div class="flex justify-between items-center">
                          <h2 class="text-xl font-semibold">Process Payment</h2>
                          <v-btn
                            icon
                            @click="closeEdit"
                            variant="text"
                            color="white"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </div>
                      </div>
                      <div class="p-6">
                        <v-form @submit.prevent="makePayment(editedItem)">
                          <!-- Edit Cattle Form Fields -->
                          <div class="space-y-4">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Name *"
                              variant="outlined"
                              density="comfortable"
                              type="text"
                              required
                              disabled
                            ></v-text-field>

                            <v-text-field
                              v-model="editedItem.amount"
                              label="Amount *"
                              variant="outlined"
                              density="comfortable"
                              type="number"
                              required
                            ></v-text-field>
                          </div>
                          <div class="flex justify-end space-x-3 mt-6">
                            <v-btn
                              @click="closeProcess"
                              variant="outlined"
                              color="grey-darken-1"
                            >
                              Cancel
                            </v-btn>
                            <v-btn
                              type="submit"
                              color="blue-darken-2"
                              variant="elevated"
                            >
                              Update
                            </v-btn>
                          </div>
                        </v-form>
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-dialog>

              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card class="rounded-xl">
                  <v-card-title class="text-h5 bg-red-50 px-6 py-4 border-b">
                    Confirm Deletion
                  </v-card-title>
                  <v-card-text class="px-6 py-4 text-gray-700">
                    Are you sure you want to delete this cattle record? This
                    action cannot be undone.
                  </v-card-text>
                  <v-card-actions class="px-6 py-4 bg-gray-50 rounded-b-xl">
                    <v-spacer></v-spacer>
                    <v-btn
                      color="grey-darken-1"
                      variant="outlined"
                      @click="closeDelete"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="red-darken-1"
                      variant="elevated"
                      @click="deleteItemConfirm"
                    >
                      Delete
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>

          <!-- Actions Column - Icon Version (Bulletproof) -->
          <template v-slot:item.actions="{ item }">
            <div
              class="action-icons"
              style="
                display: flex !important;
                justify-content: flex-end;
                gap: 12px;
                padding: 8px 16px !important;
                opacity: 1 !important;
                visibility: visible !important;
              "
            >
              <!-- Edit Icon -->
              <span
                style="
                  color: #1976d2 !important;
                  cursor: pointer;
                  font-size: 15px;
                "
                @click.stop="processPayment(item)"
                title="Process Payment"
              >
                <v-icon>mdi-cash</v-icon>
              </span>

              <!-- Edit Icon -->
              <span
                style="
                  color: #1976d2 !important;
                  cursor: pointer;
                  font-size: 15px;
                "
                @click.stop="editItem(item)"
                title="Edit"
              >
                <v-icon>mdi-pencil</v-icon>
              </span>

              <!-- Delete Icon -->
              <span
                style="
                  color: #ff5252 !important;
                  cursor: pointer;
                  font-size: 15px;
                "
                @click.stop="deleteItem(item)"
                title="Delete"
              >
                <v-icon>mdi-delete</v-icon>
              </span>
            </div>
          </template>
          <template v-slot:item.category="{ item }">
            {{ formatText(item.category) }}
          </template>
          <template v-slot:item.type="{ item }">
            {{ formatText(item.type) }}
          </template>
          <template v-slot:item.lastPaymentDate="{ item }">
            <!-- {{ formatDate(item.lastPaymentDate) }} -->
            {{ $toEthiopianString(item.lastPaymentDate) }}
          </template>

          <!-- No Data Slot -->
          <template v-slot:no-data>
            <div class="py-8 text-center text-gray-500">
              <v-icon size="64" color="grey-lighten-2">mdi-account-off</v-icon>
              <div class="text-lg mt-2">No records found</div>
              <v-btn
                color="deep-purple-accent-4"
                variant="outlined"
                class="mt-4"
                @click="fetchCustomers"
              >
                Refresh
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import EthiopianDatePicker from "@/components/EthiopianDatePicker.vue";

export default {
  components: { EthiopianDatePicker },
  data: () => ({
    dialogAdd: false, // Separate dialog for Add Customer
    dialogEdit: false, // Separate dialog for Edit Cattle
    dialogProcess: false, // Separate dialog for Process Payment
    dialogDelete: false,
    drawer: false,
    headers: [
      { title: "Name", align: "start", key: "name" },
      { title: "Amount", key: "amount" },
      { title: "Due Day", key: "monthlyDueDay" },
      { title: "Last payment Date", key: "lastPaymentDate" },
      { title: "Address", key: "address" },
      { title: "Type", key: "type" },
      { title: "Status", key: "status" },
      { title: "Actions", key: "actions", sortable: false, width: "120px" },
    ],
    search: "",
    editedIndex: -1,
    editedItem: {
      name: "", // Changed from author to name to match your template
      breed: "",
      birthDate: null,
    },
    defaultItem: {
      category: "",
      maxCopies: "",
      title: "",
      name: "",
      isbn: "",
      shelfNo: "",
      availableForOutsideReaders: false,
    },
    options: [
      { text: "Regular", value: "regular" },
      { text: "Contract", value: "contract" },
    ],
    statusOptions: [
      { text: "Active", value: "active" },
      { text: "Inactive", value: "inactive" },
      { text: "Overdue", value: "overdue" },
      { text: "Suspended", value: "suspended" },
    ],
  }),

  computed: {
    ...mapGetters("customer", [
      "loading",
      "error",
      "customers",
      "overDueCustomers",
    ]),
  },

  watch: {
    dialogAdd(val) {
      val || this.closeAdd();
    },
    dialogEdit(val) {
      val || this.closeEdit();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.fetchCustomers();
  },

  methods: {
    ...mapActions("customer", [
      "getAllCustomers",
      "getOverDueCustomers",
      "processMakePayment",
      "deleteCustomer",
      "addCustomer",
      "updateCustomer",
    ]),

    fetchCustomers() {
      this.getAllCustomers();
      this.getOverDueCustomers();
    },

    // Add Customer Methods
    openAdd() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.dialogAdd = true;
    },

    closeAdd() {
      this.dialogAdd = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
      });
    },

    async save() {
      const payload = {
        name: this.editedItem.name,
        address: this.editedItem.address,
        date: this.editedItem.date,
        amount: Number(this.editedItem.amount),
        type: this.editedItem.type,
        monthlyDueDay: Number(this.editedItem.monthlyDueDay) || null,
        lastPaymentDate: this.editedItem.lastPaymentDate
          ? new Date(this.editedItem.lastPaymentDate)
          : null,
      };
      try {
        await this.addCustomer(payload);
        this.fetchCustomers();
        this.closeAdd();
      } catch (error) {
        console.error("Error adding customer:", error);
      }
    },

    // Edit Cattle Methods
    editItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogEdit = true;
    },

    processPayment(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogProcess = true;
    },

    closeEdit() {
      this.dialogEdit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeProcess() {
      this.dialogProcess = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async updateItem() {
      try {
        await this.updateCustomer({
          id: this.editedItem._id,
          customerData: this.editedItem,
        });
        this.fetchCustomers();
        this.closeEdit();
      } catch (error) {
        console.error("Error updating customer:", error);
      }
    },
    async makePayment() {
      try {
        console.log("Making payment for customer ID:", this.editedItem._id);
        await this.processMakePayment({
          id: this.editedItem._id,
          amount: this.editedItem.amount,
        });
        this.fetchCustomers();
        this.closeProcess();
      } catch (error) {
        console.error("Error updating customer:", error);
      }
    },

    // Delete Methods
    deleteItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      const index = this.customers.indexOf(this.editedItem);
      try {
        this.customers.splice(index, 1);
        await this.deleteCustomer(this.editedItem._id);
        this.fetchCustomers();
      } catch (error) {
        this.customers.splice(index, 0, this.editedItem);
        console.error("Error deleting customer:", error);
      }
      this.closeDelete();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    formatDate(date) {
      if (!date) return "";
      return new Date(date).toISOString().split("T")[0]; // Keeps only the YYYY-MM-DD part
    },
    formatText(snakeCaseStr) {
      if (!snakeCaseStr) return "";
      return snakeCaseStr
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
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
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Smooth transitions */
.v-data-table {
  transition: all 0.3s ease;
}

/* Better focus states */
.v-btn:focus-visible,
.v-text-field input:focus-visible {
  outline: 2px solid rgba(124, 58, 237, 0.5);
  outline-offset: 2px;
}
/* Force action buttons to be visible */
.v-data-table .v-data-table__td:last-child {
  opacity: 1 !important;
  visibility: visible !important;
}

/* Action buttons styling - bulletproof */
.action-buttons {
  display: flex !important;
  justify-content: flex-end;
  gap: 12px;
  padding: 8px 16px !important;
}

.action-button {
  color: inherit !important;
  font-weight: 500 !important;
  font-size: 0.875rem !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  min-width: auto !important;
  padding: 0 !important;
  margin: 0 !important;
}

.action-button.edit {
  color: #1976d2 !important;
}

.action-button.delete {
  color: #ff5252 !important;
}

/* Debug border - remove after confirming it works */
.debug-border {
  border: 1px solid red !important;
}
</style>
