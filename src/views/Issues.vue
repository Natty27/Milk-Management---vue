<template>
  <v-progress-linear color="green" indeterminate v-if="loading"></v-progress-linear>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <Sidebar />
    <!-- Main Content -->

    <div class="flex flex-col flex-1 overflow-y-auto">
      <Header />
      <div class="p-4">
        <!-- Tabs -->
        <div class="flex justify-center space-x-4 border-b mb-4">
          <button 
            v-for="(tab, index) in tabs" 
            :key="index" 
            @click="activeTab = index" 
            :class="{'border-b-2 border-purple-500 text-purple-500': activeTab === index, 'text-gray-600': activeTab !== index}"
            class="py-2 px-4 focus:outline-none"
          >
            {{ tab }}
          </button>
        </div>
        <div v-if="activeTab === 0">
          <v-data-table
            :headers="headersTab1"
            :items="issuesTab1"
            :search="search"
            :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          >
            <!-- Toolbar and Dialogs -->
            <template v-slot:top>
              <div class="flex items-center mb-4">
                <h2 class="text-xl font-bold mr-4">Pending List</h2>
                <div class="flex-grow border-t border-gray-300"></div>
                <v-btn @click="fetchIssuesTab1" class="ml-4">Refresh</v-btn>
                <v-text-field v-model="search" label="Search" clearable solo-inverted hide-details class="ml-4"></v-text-field>
              </div>

              <div v-if="dialogDelete" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                <!-- Modal Container -->
                <div class="bg-white max-w-lg w-full rounded-lg shadow-lg">
                  <!-- Modal Header -->
                  <div class="border-b p-4">
                    <h2 class="text-xl font-semibold">Are you sure you want to delete this item?</h2>
                  </div>
                  <!-- Modal Footer -->
                  <div class="border-t p-4 flex justify-end space-x-4">
                    <button @click="closeDelete" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Cancel
                    </button>
                    <button @click="confirmDelete" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </template>


            <!-- Actions Column -->
            <template v-slot:item.actions="{ item }">
              <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 mr-2" v-if="item.status=='Pending'" @click="approve(item)">Approve</button>
              <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 mr-2" v-if="item.status=='Approved'" @click="returned(item)">Return</button>
              <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500" @click="deleteItem(item)">Delete</button>
            </template>

            <!-- No Data Slot -->
            <template v-slot:no-data>
              <v-btn color="purple" @click="fetchIssuesTab1">
                Reset
              </v-btn>
            </template>
          </v-data-table>
        </div>
        <div v-else-if="activeTab === 1">
          <v-data-table
            :headers="headersTab2"
            :items="issuesTab2"
            :search="search"
            :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          >
            <!-- Toolbar and Dialogs -->
            <template v-slot:top>
              <div class="flex items-center mb-4">
                <h2 class="text-xl font-bold mr-4">Approved List</h2>
                <div class="flex-grow border-t border-gray-300"></div>
                <v-btn @click="fetchIssuesTab2" class="ml-4">Refresh</v-btn>
                <v-text-field v-model="search" label="Search" clearable solo-inverted hide-details class="ml-4"></v-text-field>
              </div>

              <div v-if="dialogDelete" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                <!-- Modal Container -->
                <div class="bg-white max-w-lg w-full rounded-lg shadow-lg">
                  <!-- Modal Header -->
                  <div class="border-b p-4">
                    <h2 class="text-xl font-semibold">Are you sure you want to delete this item?</h2>
                  </div>
                  <!-- Modal Footer -->
                  <div class="border-t p-4 flex justify-end space-x-4">
                    <button @click="closeDelete" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Cancel
                    </button>
                    <button @click="confirmDelete" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      OK
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="dialogReturn" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                <!-- Modal Container -->
                <div class="bg-white max-w-lg w-full rounded-lg shadow-lg">
                  <!-- Modal Header -->
                  <div class="border-b p-4">
                    <h2 class="text-xl font-semibold">Return Book</h2>
                  </div>
                  <!-- Modal Body -->
                  <div class="p-4">
                    <textarea v-model="note" placeholder="Note" rows="3" class="w-full border rounded-md p-2 resize-none" />
                  </div>
                  <!-- Modal Footer -->
                  <div class="border-t p-4 flex justify-end space-x-4">
                    <button @click="closeReturn" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                      Cancel
                    </button>
                    <button @click="confirmReturn" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                      Confirm
                    </button>
                  </div>
                </div>
              </div>

            </template>

            <!-- Actions Column -->
            <template v-slot:item.actions="{ item }">
              <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 mr-2" v-if="item.status=='Pending'" @click="approve(item)">Approve</button>
              <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 mr-2" v-if="item.status=='Approved'" @click="openReturnDialog(item)">Return</button>
              <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500" @click="deleteItem(item)">Delete</button>
            </template>

            <!-- No Data Slot -->
            <template v-slot:no-data>
              <v-btn color="purple" @click="fetchIssuesTab2">
                Reset
              </v-btn>
            </template>
          </v-data-table>
        </div>
        <div v-else-if="activeTab === 2">
          <v-data-table
            :headers="headersTab3"
            :items="issuesTab3"
            :search="search"
            :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          >
            <!-- Toolbar and Dialogs -->
            <template v-slot:top>
              <div class="flex items-center mb-4">
                <h2 class="text-xl font-bold mr-4">Returned List</h2>
                <div class="flex-grow border-t border-gray-300"></div>
                <v-btn @click="fetchIssuesTab3" class="ml-4">Refresh</v-btn>
                <v-text-field v-model="search" label="Search" clearable solo-inverted hide-details class="ml-4"></v-text-field>
              </div>

              <div v-if="dialogDelete" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                <!-- Modal Container -->
                <div class="bg-white max-w-lg w-full rounded-lg shadow-lg">
                  <!-- Modal Header -->
                  <div class="border-b p-4">
                    <h2 class="text-xl font-semibold">Are you sure you want to delete this item?</h2>
                  </div>
                  <!-- Modal Footer -->
                  <div class="border-t p-4 flex justify-end space-x-4">
                    <button @click="closeDelete" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Cancel
                    </button>
                    <button @click="confirmDelete" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      OK
                    </button>
                  </div>
                </div>
              </div>

                          <!-- Modal Background -->
              <div v-if="dialogView" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                <!-- Modal Container -->
                <div class="bg-white max-w-lg w-full rounded-lg shadow-lg">
                  <!-- Modal Header -->
                  <div class="border-b p-4 flex items-center justify-between">
                    <h2 class="text-xl font-semibold">Issue Details</h2>
                    <button @click="closeView" class="text-blue-600 hover:text-blue-800">
                      Close
                    </button>
                  </div>
                  <!-- Modal Body -->
                  <div class="p-4">
                    <p><strong>Requester ID:</strong> {{ viewItem?.requestedById }}</p>
                    <p><strong>Name:</strong> {{ viewItem?.requestedByName }}</p>
                    <p><strong>Book Title:</strong> {{ viewItem?.bookTitle }}</p>
                    <p><strong>Time and Date of Issue:</strong> {{ viewItem?.createdAt }}</p>
                    <p><strong>Status:</strong> {{ viewItem?.status }}</p>
                    <p><strong>Note:</strong> {{ viewItem?.note }}</p>
                  </div>
                  <!-- Modal Footer -->
                  <!-- <div class="border-t p-4 flex justify-end">
                    <button @click="closeView" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Close
                    </button>
                  </div> -->
                </div>
              </div>

            </template>

            <!-- Actions Column -->
            <template v-slot:item.actions="{ item }">
              <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 mr-2" v-if="item.status=='Pending'" @click="approve(item)">Approve</button>
              <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 mr-2" v-if="item.status=='Returned'" @click="openViewDialog(item)">View</button>
              <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500" @click="deleteItem(item)">Delete</button>
            </template>

            <!-- No Data Slot -->
            <template v-slot:no-data>
              <v-btn color="purple" @click="fetchIssuesTab3">
                Reset
              </v-btn>
            </template>
          </v-data-table>
        </div>
        <div v-else-if="activeTab === 3">
          <v-data-table
            :headers="headersTab4"
            :items="issuesTab4"
            :search="search"
            :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          >
            <!-- Toolbar and Dialogs -->
            <template v-slot:top>
              <div class="flex items-center mb-4">
                <h2 class="text-xl font-bold mr-4">Queue List</h2>
                <div class="flex-grow border-t border-gray-300"></div>
                <v-btn @click="fetchIssuesTab4" class="ml-4">Refresh</v-btn>
                <v-text-field v-model="search" label="Search" clearable solo-inverted hide-details class="ml-4"></v-text-field>
              </div>

              <div v-if="dialogDelete" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                <!-- Modal Container -->
                <div class="bg-white max-w-lg w-full rounded-lg shadow-lg">
                  <!-- Modal Header -->
                  <div class="border-b p-4">
                    <h2 class="text-xl font-semibold">Are you sure you want to delete this item?</h2>
                  </div>
                  <!-- Modal Footer -->
                  <div class="border-t p-4 flex justify-end space-x-4">
                    <button @click="closeDelete" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Cancel
                    </button>
                    <button @click="confirmDelete" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <!-- Actions Column -->
            <template v-slot:item.actions="{ item }">
              <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 mr-2" v-if="item.status=='Pending' || 'Queue'" @click="approve(item)">Approve</button>
              <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 mr-2" v-if="item.status=='Approved'" @click="returned(item)">Return</button>
              <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500" @click="deleteItem(item)">Delete</button>
            </template>

            <!-- No Data Slot -->
            <template v-slot:no-data>
              <v-btn color="purple" @click="fetchIssuesTab4">
                Reset
              </v-btn>
            </template>
          </v-data-table>
        </div>
        <div v-else-if="activeTab === 4">
          <!-- Content for Tab 5 -->
          <!-- <p>Still under development!</p> -->
          <h1 class="text-xl font-bold mr-4">Still under development!</h1>
        </div>
        <div v-else-if="activeTab === 5">
          <v-data-table
            :headers="headersTab1"
            :items="issuesTab5"
            :search="search"
            :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          >
            <!-- Toolbar and Dialogs -->
            <template v-slot:top>
              <div class="flex items-center mb-4">
                <h2 class="text-xl font-bold mr-4">Expired List</h2>
                <div class="flex-grow border-t border-gray-300"></div>
                <v-btn @click="fetchIssuesTab5" class="ml-4">Refresh</v-btn>
                <v-text-field v-model="search" label="Search" clearable solo-inverted hide-details class="ml-4"></v-text-field>
              </div>

              <div v-if="dialogDelete" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                <!-- Modal Container -->
                <div class="bg-white max-w-lg w-full rounded-lg shadow-lg">
                  <!-- Modal Header -->
                  <div class="border-b p-4">
                    <h2 class="text-xl font-semibold">Are you sure you want to delete this item?</h2>
                  </div>
                  <!-- Modal Footer -->
                  <div class="border-t p-4 flex justify-end space-x-4">
                    <button @click="closeDelete" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Cancel
                    </button>
                    <button @click="confirmDelete" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </template>


            <!-- Actions Column -->
            <template v-slot:item.actions="{ item }">
              <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 mr-2" v-if="item.status=='Pending'" @click="approve(item)">Approve</button>
              <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 mr-2" v-if="item.status=='Approved'" @click="returned(item)">Return</button>
              <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500" @click="deleteItem(item)">Delete</button>
            </template>

            <!-- No Data Slot -->
            <template v-slot:no-data>
              <v-btn color="purple" @click="fetchIssuesTab5">
                Reset
              </v-btn>
            </template>
          </v-data-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Sidebar from '@/components/Sidebar.vue';
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';

export default {
  components: {
    Sidebar,
    Footer,
    Header
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    dialogReturn:false,
    dialogView: false,
    viewItem: {},
    note:'',
    isRefreshing: false,
    activeTab: 0,
    tabs: ['Pending', 'Approved', 'Returned', 'Queued', 'Out of Time','Expired'],
    search: '',
    editedIndex: -1,
    headersTab1: [
      {
        title: 'Requester ID',
        align: 'start',
        sortable: false,
        key: 'requestedById',
      },
      { title: 'Name', key: 'requestedByName', sortable: false },
      { title: 'Book Title', key: 'bookTitle', sortable: false },
      { title: 'Time and Date of Issue', key: 'createdAt', sortable: false },
      { title: 'Status', key: 'status', sortable: false },
      { title: 'Actions', key: 'actions', sortable: false },
    ],
    headersTab2: [
      {
        title: 'Requester ID',
        align: 'start',
        sortable: false,
        key: 'requestedById',
      },
      { title: 'Name', key: 'requestedByName', sortable: false },
      { title: 'Book Title', key: 'bookTitle', sortable: false },
      { title: 'Time and Date of Issue', key: 'createdAt', sortable: false },
      { title: 'Status', key: 'status', sortable: false },
      { title: 'Actions', key: 'actions', sortable: false },
    ],

    headersTab3: [
      {
        title: 'Requester ID',
        align: 'start',
        sortable: false,
        key: 'requestedById',
      },
      { title: 'Name', key: 'requestedByName', sortable: false },
      { title: 'Book Title', key: 'bookTitle', sortable: false },
      { title: 'Time and Date of Issue', key: 'createdAt', sortable: false },
      { title: 'Status', key: 'status', sortable: false },
      { title: 'Actions', key: 'actions', sortable: false },
    ],


    headersTab4: [
      {
        title: 'Requester ID',
        align: 'start',
        sortable: false,
        key: 'requestedById',
      },
      { title: 'Name', key: 'requestedByName', sortable: false },
      { title: 'Book Title', key: 'bookTitle', sortable: false },
      { title: 'Time and Date of Issue', key: 'createdAt', sortable: false },
      { title: 'Status', key: 'status', sortable: false },
      { title: 'Actions', key: 'actions', sortable: false },
    ],

    headersTab5: [
      {
        title: 'Requester ID',
        align: 'start',
        sortable: false,
        key: 'requestedById',
      },
      { title: 'Name', key: 'requestedByName', sortable: false },
      { title: 'Book Title', key: 'bookTitle', sortable: false },
      { title: 'Time and Date of Issue', key: 'createdAt', sortable: false },
      { title: 'Status', key: 'status', sortable: false },
      { title: 'Actions', key: 'actions', sortable: false },
    ],
  }),

  

  computed: {
    ...mapGetters('issue', ['loading', 'error', 'issues']),
    issuesTab1() {
      return this.issues.filter(issue => issue.status === "Pending");
    },
    issuesTab2() {
      return this.issues.filter(issue => issue.status === "Approved");
    },

    issuesTab3() {
      return this.issues.filter(issue => issue.status === "Returned");
    },

    issuesTab4() {
      return this.issues.filter(issue => issue.status === "Queue");
    },

    issuesTab5() {
      return this.issues.filter(issue => issue.status === "Expired");
    }

  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.fetchIssuesTab1();
    this.fetchIssuesTab2();
    this.fetchIssuesTab3();
    this.fetchIssuesTab4();
  },

  methods: {
    ...mapActions('issue', ['getAllIssues', 'deleteIssue', 'saveIssue', 'updateIssue','getIssuesByStatus']),

    fetchIssuesTab1() {
      this.getAllIssues({ tab:1 });
    },

    fetchIssuesTab2() {
      this.getAllIssues({ tab: 2 });
    },

    fetchIssuesTab3() {
      this.getAllIssues({ tab: 3 });
    },
    fetchIssuesTab4() {
      this.getAllIssues({ tab: 4 });
    },
    fetchIssuesTab5() {
      this.getAllIssues({ tab: 5 });
    },

    openReturnDialog(item) {
      this.dialogReturn = true;
      this.editedItem = item;
    },

    openViewDialog(item) {
    this.viewItem = item;
    this.dialogView = true;
  },

  closeView() {
    this.dialogView = false;
    this.viewItem = null;
  },

    approve(item) {
      const updatedItem = { ...item, status: 'Approved' };
      this.updateIssue({ id: item._id, issueData: updatedItem }).then(() => {
        this.fetchIssuesTab1();
        this.fetchIssuesTab2();
        this.fetchIssuesTab3();
        this.fetchIssuesTab4();
        this.fetchIssuesTab5();
      });
    },

    returned(item) {
      
    },

    editItem(item) {
      this.editedIndex = this.issues.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    

    async confirmDelete() {
      const index = this.issues.indexOf(this.editedItem);

      try {
        // Optimistically remove the item from the UI
        this.issues.splice(index, 1);

        // Attempt to delete the item from the server
        await this.deleteIssue(this.editedItem._id).then(() => {
          this.fetchIssuesTab1();
          this.fetchIssuesTab2();
          this.fetchIssuesTab3();
          this.fetchIssuesTab4();
          this.fetchIssuesTab5();
        });

        // Close the dialog
        this.closeDelete();
      } catch (error) {
        // If there is an error, re-add the item to the UI
        this.issues.splice(index, 0, this.editedItem);
        console.error('Error deleting issue:', error);
      }
    },

    closeReturn() {
      this.dialogReturn = false;
      this.note = ''; // Clear the textarea
    },
    async confirmReturn() {
  if (!this.editedItem) {
    console.error('No item selected for return.');
    return;
  }

  const updatedItem = {
    ...this.editedItem,
    status: 'Returned',
    note: this.note
  };

  try {
    console.log(updatedItem)
    await this.updateIssue({ id: this.editedItem._id, issueData: updatedItem });

    // Refresh issue lists
    this.fetchIssuesTab1();
    this.fetchIssuesTab2();
    this.fetchIssuesTab3();
    this.fetchIssuesTab4();
    this.fetchIssuesTab5();

    // Close the return dialog
    this.closeReturn();
  } catch (error) {
    console.error('Error updating issue:', error);
  }
},


    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        this.saveIssue(this.editedItem);
      } else {
        // Handle new item creation
      }
      this.close();
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
