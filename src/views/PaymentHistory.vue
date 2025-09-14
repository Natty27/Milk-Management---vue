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
          :items="paymentHistorys"
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
                Payment History
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
                              v-model="editedItem.customerId.name"
                              label="Name *"
                              variant="outlined"
                              density="comfortable"
                              type="text"
                              readonly
                            ></v-text-field>

                            <v-text-field
                              v-model="editedItem.amount"
                              label="Payment Amount (ETB) *"
                              variant="outlined"
                              density="comfortable"
                              type="number"
                              readonly
                            ></v-text-field>

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
                          <h2 class="text-xl font-semibold">Print</h2>
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
                        <v-form @submit.prevent="print(editedItem)">
                          <!-- Edit Cattle Form Fields -->
                          <h3>Are you sure you want to print the invoice?</h3>
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
                              Print
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
                <v-icon>mdi-printer</v-icon>
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
          <template v-slot:item.status="{ item }">
            {{ formatText(item.status) }}
          </template>
          <template v-slot:item.paymentDate="{ item }">
            {{ $toEthiopianString(item.paymentDate) }}
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
                @click="fetchPaymentHistorys"
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

export default {
  data: () => ({
    dialogAdd: false, // Separate dialog for Add Customer
    dialogEdit: false, // Separate dialog for Edit Cattle
    dialogProcess: false, // Separate dialog for Process Payment
    dialogDelete: false,
    drawer: false,
    headers: [
      { title: "Name", align: "start", key: "customerId.name" },
      { title: "Reference Number", key: "referenceNumber" },
      { title: "Amount", key: "amount" },
      { title: "Payment Date", key: "paymentDate" },
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
      { text: "Success", value: "success" },
      { text: "Failed", value: "failed" },
      { text: "Pending", value: "pending" },
      { text: "Refunded", value: "refunded" },
    ],
  }),

  computed: {
    ...mapGetters("customer", ["loading", "error", "paymentHistorys"]),
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
    this.fetchPaymentHistorys();
  },

  methods: {
    ...mapActions("customer", [
      "getAllCustomers",
      "getOverDueCustomers",
      "getPaymentHistorys",
      "processMakePayment",
      "deleteCustomer",
      "addCustomer",
      "updatePaymentRequest",
    ]),

    async fetchPaymentHistorys() {
      await this.getPaymentHistorys();
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
        amount: Number(this.editedItem.amount),
        type: this.editedItem.type,
        monthlyDueDay: Number(this.editedItem.monthlyDueDay) || null,
        lastPaymentDate: this.editedItem.lastPaymentDate
          ? new Date(this.editedItem.lastPaymentDate)
          : null,
      };
      try {
        await this.addCustomer(payload);
        this.fetchPaymentHistorys();
        this.closeAdd();
      } catch (error) {
        console.error("Error adding customer:", error);
      }
    },

    // Edit Cattle Methods
    editItem(item) {
      this.editedIndex = this.paymentHistorys.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogEdit = true;
    },

    processPayment(item) {
      this.editedIndex = this.paymentHistorys.indexOf(item);
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
        await this.updatePaymentRequest({
          id: this.editedItem._id,
          paymentHistoryData: this.editedItem,
        });
        this.fetchPaymentHistorys();
        this.closeEdit();
      } catch (error) {
        console.error("Error updating customer:", error);
      }
    },
    async print(item) {
      const paymentDate = item.paymentDate;
      console.log("Printing item:", item);

      const printContent = `
  <div style="font-family: monospace; font-size: 14px; width: 58mm;">
    <div style="text-align: center; margin-bottom: 10px;">
      <h3 style="margin:0;">Mama Tsega Dairy Products</h3>
      <p style="margin:0;">Tel: +251-914-759-258</p>
      <p style="margin:0;">Mekelle, Ethiopia</p>
      <p>------------------------------</p>
    </div>

    <p>Customer : ${item.customerId?.name || "N/A"}</p>
    <p>Amount   : ${item.amount} ETB</p>
    <p>Last Payment Date : ${this.$toEthiopianString(
      item.customerId?.lastPaymentDate
    )}</p>
    <p>Date     : ${this.$toEthiopianString(paymentDate)}</p>
    <p>Ref No   : ${item.referenceNumber}</p>
    <p>Status   : ${item.status}</p>
    <p>------------------------------</p>

    <div style="text-align: center; margin-top: 10px;">
      <p>*** Thank You! ***</p>
    </div>
  </div>
`;

      const printWindow = window.open("", "", "width=400,height=600");
      printWindow.document.write(`
  <html>
    <head>
      <title>Receipt</title>
      <style>
        @page {
          size: 58mm auto; /* POS printer width */
          margin: 0;       /* No margins */
        }
        body {
          margin: 0;
          padding: 5px;
          font-family: monospace;
          font-size: 14px; /* Increased font size */
        }
      </style>
    </head>
    <body>${printContent}</body>
  </html>
`);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    },
    // Delete Methods
    deleteItem(item) {
      this.editedIndex = this.paymentHistorys.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      const index = this.paymentHistorys.indexOf(this.editedItem);
      try {
        this.paymentHistorys.splice(index, 1);
        await this.deleteCustomer(this.editedItem._id);
        this.fetchPaymentHistorys();
      } catch (error) {
        this.paymentHistorys.splice(index, 0, this.editedItem);
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
