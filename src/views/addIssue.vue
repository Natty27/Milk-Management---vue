<template>
  <div v-if="loadingState || searchLoading" class="fixed inset-0 flex items-center justify-center bg-opacity-75 bg-gray-900 z-50">
    <div class="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
  </div>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <Sidebar />
    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-y-auto">
      <Header />
      <div class="p-4">
        <div class="container mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="flex justify-center py-4">
            <h2 class="text-3xl font-semibold text-gray-800">Add Issue</h2>
          </div>
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
          <div v-if="currentUser && !searchLoading" class="mt-4">
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
          </div>

          <form v-if="userSelected" @submit.prevent="addIssues" class="px-8 py-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Category</label>
                <select v-model="selectedCategory" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow duration-300 ease-in-out" required>
                  <option value="" disabled>Select a category</option>
                  <option v-for="category in categorys" :key="category.categoryName" :value="category.categoryName">
                    {{ category.categoryName }}
                  </option>
                </select>
              </div>

              <div v-if="selectedCategory">
                <label class="block text-sm font-medium text-gray-700">Book Title</label>
                <div class="relative">
                  <input type="text" v-model="title" @input="filterBooks" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow duration-300 ease-in-out" />
                  <ul v-if="filteredBooks.length" class="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg">
                    <li v-for="book in filteredBooks" :key="book.title" @click="selectBook(book.title)" class="px-4 py-2 cursor-pointer hover:bg-gray-100">
                      {{ book.title }}
                    </li>
                  </ul>
                </div>
              </div>

              <div v-if="selectedCategory">
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <select v-model="status" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow duration-300 ease-in-out" required>
                  <option value="" disabled>Select a status</option>
                  <option value="Approved">Approved</option>
                  <option value="Queue">Queued</option>
                </select>
              </div>

            </div>
            <div v-if="errorState" class="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong class="font-bold">Error:</strong>
              <span class="block sm:inline">{{ errorState.message }}</span>
            </div>
            <div class="flex justify-center mt-6">
              <button type="submit" class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Footer from '@/components/Footer.vue';
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/Header.vue';

export default {
  components: {
    Footer,
    Sidebar,
    Header
  },
  data() {
    return {
      title: '',
      selectedCategory: '',
      requestedById: '',
      searchLoading: false,
      userSelected: false,
      filteredBooks: [],
      status:'',
      stav:''
    };
  },
  created() {
    this.fetchCategorys();
    this.fetchBooks();
  },
  computed: {
    ...mapGetters('book', {
      bookLoading: 'loading',
      bookError: 'error',
      books: 'books',
      
    }),
    ...mapGetters('category', {
      categoryLoading: 'loading',
      categoryError: 'error',
      categorys: 'categorys'
    }),
    ...mapGetters('auth', {
      authLoading: 'loading',
      authError: 'error',
      currentUser: 'currentUser'
    }),
    loadingState() {
      return this.bookLoading || this.categoryLoading || this.authLoading;
    },
    errorState() {
      return this.bookError || this.categoryError || this.authError;
    }
  },
  methods: {
    ...mapActions('book', ['addBook', 'getAllBooks','getBooksByName']),
    ...mapActions('issue', ['addIssue']),
    ...mapActions('category', ['getAllCategorys']),
    ...mapActions('auth', ['getUserByID', 'getUserByName']),
    async addIssues() {
    const selectedBook = this.books.find(book => book.category === this.selectedCategory && book.title === this.title);

    if (selectedBook) {
      try {
        await this.addIssue({
          bookID: selectedBook._id,
          bookTitle: selectedBook.title,
          author: selectedBook.author,
          isbn: selectedBook.isbn,
          category: selectedBook.category,
          requestedById: this.currentUser._id,
          requestedByName: this.currentUser.firstName,
          status: this.status
        });
        this.$router.push('/issues'); // Route to /issues after the issue is added
      } catch (error) {
        console.error('Error adding issue:', error);
      }
    } else {
      console.error('No matching book found');
    }
  },
    async useId() {
      this.searchLoading = true;
      try {
        await this.getUserByID(this.requestedById);
        console.log(this.currentUser);
      } catch (error) {
        console.error(error);
      } finally {
        this.searchLoading = false;
      }
    },
    fetchCategorys() {
      this.getAllCategorys();
    },
    fetchBooks() {
      this.getAllBooks();
    },
    selectUser(userId) {
      this.userSelected = true;
    },
    filterBooks() {
      const searchTerm = this.title.toLowerCase();
      this.filteredBooks = this.books.filter(book => book.title.toLowerCase().includes(searchTerm) && book.category === this.selectedCategory);
    },
    selectBook(title) {
      this.title = title;
      this.filteredBooks = [];
    }
  }
};
</script>

<style scoped>
/* Custom styling for animation and transitions */
input[type="text"], textarea {
  transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}
button {
  transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;
}
button:hover, .hover\:bg-gray-300:hover {
  background-color: #E5E7EB;
}
</style>
