<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Loading Indicator -->
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="w-16 h-16 border-4 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
    </div>
    
    <!-- Main Content -->
    <div class="min-h-screen flex">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main Content Area -->
      <div class="flex flex-col flex-1 overflow-y-auto">
        <Header />
        
        <div class="p-4">
          <!-- Book Details Card -->
          <div v-if="selectedBook" class="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 max-w-full mx-auto">
            <div class="relative h-80">
              <img :src="getBookImage(selectedBook)" class="absolute inset-0 w-full h-full object-cover" alt="Book Image" />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-4 text-white">
                <h2 class="text-3xl font-bold">
                  <i class="mdi mdi-book mr-2"></i>{{ selectedBook.title }}
                </h2>
                <h3 class="text-xl mt-1">{{ selectedBook.author }}</h3>
              </div>
            </div>
            <div class="p-6">
              <div class="flex flex-col md:flex-row md:space-x-8 mb-4">
                <div class="flex-1">
                  <p class="text-gray-700 mb-2"><strong><i class="mdi mdi-tag mr-2"></i>Category:</strong> {{ selectedBook.category }}</p>
                  <p class="text-gray-700 mb-2"><strong><i class="mdi mdi-barcode mr-2"></i>ISBN:</strong> {{ selectedBook.isbn }}</p>
                  <p class="text-gray-700 mb-2"><strong><i class="mdi mdi-bookshelf mr-2"></i>Shelf No:</strong> {{ selectedBook.shelfNo }}</p>
                </div>
                <div class="flex-1">
                  <p class="text-gray-700 mb-2"><strong><i class="mdi mdi-information mr-2"></i>Description:</strong> {{ selectedBook.description }}</p>
                </div>
              </div>

              <div v-if="dialogIssue" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                <!-- Modal Container -->
                <div class="bg-white w-full max-w-2xl rounded-lg shadow-lg">
                  <!-- Modal Header -->
                  <div class="border-b p-4">
                    <h2 class="text-xl font-semibold">Issue Book</h2>
                  </div>
                  <!-- Modal Body -->
                  <div class="p-4">
                    <div class="px-8 py-6">
                      <label class="block text-sm font-medium text-gray-700">Requester ID</label>
                      <input v-model="requestedById" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow duration-300 ease-in-out" required />
                      <button @click="useId" type="button" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out mt-2">Search</button>
                    </div>

                    <!-- Loading Indicator -->
                    <div v-if="searchLoading" class="flex justify-center items-center mt-4">
                      <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-green-500"></div>
                    </div>

                    <!-- User Details Table -->
                    <div v-if="currentUser && !searchLoading" class="mt-4 overflow-x-auto">
                      <table class="min-w-full bg-white">
                        <thead>
                          <tr>
                            <th class="py-2 px-4 border-b-2 border-gray-200">ID</th>
                            <th class="py-2 px-4 border-b-2 border-gray-200">First Name</th>
                            <th class="py-2 px-4 border-b-2 border-gray-200">Last Name</th>
                            <th class="py-2 px-4 border-b-2 border-gray-200">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="py-2 px-4 border-b border-gray-200">{{ currentUser._id }}</td>
                            <td class="py-2 px-4 border-b border-gray-200">{{ currentUser.firstName }}</td>
                            <td class="py-2 px-4 border-b border-gray-200">{{ currentUser.lastName }}</td>
                            <td class="py-2 px-4 border-b border-gray-200">
                              <button @click="selectUser(currentUser._id)" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-full shadow-md transition-all duration-300 ease-in-out" :class="{'bg-green-500': userSelected}">{{ userSelected ? 'Selected' : 'Select' }}</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div v-if="userSelected">
                        <label class="block text-sm font-medium text-gray-700 mt-4">Status</label>
                        <select v-model="status" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow duration-300 ease-in-out" required>
                          <option value="" disabled>Select a status</option>
                          <option value="Approved">Approved</option>
                          <option value="Queue">Queued</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <!-- Modal Footer -->
                  <div class="border-t p-4 flex justify-end space-x-4">
                    <button @click="closeIssue" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                      Cancel
                    </button>
                    <button @click="confirmIssue" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                      Confirm
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex justify-center mt-6">
                <button v-if="selectedBook.availableForOutsideReaders" @click="addIssues" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500 transition">
                  <i class="mdi mdi-book-plus mr-2"></i> Issue
                </button>
                <h2 v-if="!selectedBook.availableForOutsideReaders" class="text-3xl font-semibold text-gray-800">You can only read this book inside library.</h2>
              </div>
              <div v-if="selectedBook.availableForOutsideReaders" class="flex justify-center mt-6">
                <button @click="openIssueDialog" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-500 transition">
                  <i class="mdi mdi-book-plus mr-2"></i> Issue (if admin)
                </button>
              </div>
            </div>
          </div>
          <!-- No Book Selected -->
          <div v-else class="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h2 class="text-2xl font-bold text-gray-800">Book details not available</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/Header.vue';
import defaultBookImage1 from '@/assets/Library/default-book-image.jpg';
import defaultBookImage2 from '@/assets/Library/default-book-image-2.jpg';

export default {
  props: ['id'],
  components: {
    Sidebar,
    Header
  },
  data() {
    return {
      dialogIssue: false,
      dialogView: false,
      requestedById: '',
      searchLoading: false,
      userSelected: false,
      status: '',
      defaultBookImages: [
        defaultBookImage1,
        defaultBookImage2
      ]
    };
  },
  computed: {
    ...mapGetters('book', ['selectedBook']),
    ...mapGetters('issue', ['loading', 'error']),
    ...mapGetters('auth', {
      authLoading: 'loading',
      authError: 'error',
      currentUser: 'currentUser',
      user:'user'
    }),
  },
  async created() {
    this.fetchBookDetails();
    await this.getCurrentUser();
  },
  methods: {
    ...mapActions('book', ['getBookById']),
    ...mapActions('issue', ['addIssue']),
    ...mapActions('auth', ['getCurrentUser', 'getUserByID']),

    async fetchBookDetails() {
      this.loading = true;
      try {
        await this.getBookById(this.id);
      } catch (error) {
        console.error('Failed to fetch book details:', error);
      } finally {
        this.loading = false;
      }
    },

    async useId() {
      this.searchLoading = true;
      try {
        await this.getUserByID(this.requestedById);
      } catch (error) {
        console.error(error);
      } finally {
        this.searchLoading = false;
      }
    },

    selectUser(userId) {
      this.userSelected = true;
    },

    async addIssues() {
      try {
        await this.addIssue({
          bookID: this.selectedBook._id,
          bookTitle: this.selectedBook.title,
          author: this.selectedBook.author,
          isbn: this.selectedBook.isbn,
          category: this.selectedBook.category,
          requestedByName: this.user.firstName,
          requestedById: this.user._id,
          status: 'Pending'
        });
        this.$router.push('/myIssues'); // Route to /My issues after the issue is added
      } catch (error) {
        console.error('Error adding issue:', error);
      }
    },

    getBookImage(selectedBook) {
      if (selectedBook && selectedBook.image) {
        return selectedBook.image;
      } else {
        const randomIndex = Math.floor(Math.random() * this.defaultBookImages.length);
        return this.defaultBookImages[randomIndex];
      }
    },

    openIssueDialog(item) {
      this.dialogIssue = true;
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

    closeIssue() {
      this.dialogIssue = false;
      this.note = ''; // Clear the textarea
    },

    async confirmIssue() {
      if (!this.selectedBook) {
        console.error('No item selected for return.');
        return;
      }

      try {
        await this.addIssue({
          bookID: this.selectedBook._id,
          bookTitle: this.selectedBook.title,
          author: this.selectedBook.author,
          isbn: this.selectedBook.isbn,
          category: this.selectedBook.category,
          requestedById: this.currentUser._id,
          requestedByName: this.currentUser.firstName,
          status: this.status
        });

        // Close the return dialog
        this.closeIssue();
      } catch (error) {
        console.error('Error adding issue:', error);
      }
    },
  }
};
</script>

<style scoped>
/* Add custom styles for the modal */
.fixed {
  z-index: 50;
}

.modal-container {
  width: 80%; /* Adjust the width as needed */
  max-width: 90%;
}
</style>
