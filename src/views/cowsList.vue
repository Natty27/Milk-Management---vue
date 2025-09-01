<template>
  <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
  </div>

  <div class="min-h-screen flex">
    <!-- <Sidebar /> -->
<Sidebar :drawer="drawer"/>
    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-y-auto">
      <Header @toggle-sidebar="toggleSidebar" />

      <main class="p-4">
        <div class="container mx-auto">
          <div class="flex flex-wrap">
            <!-- Filters Section -->
            <div class="w-full md:w-1/4 p-2">
              <div class="md:hidden flex justify-between items-center">
                <button @click="toggleFilters" class="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center">
                  <i :class="filtersVisible ? 'mdi mdi-chevron-up' : 'mdi mdi-filter-variant'"></i>
                </button>
              </div>
              <div :class="{'block': filtersVisible, 'hidden': !filtersVisible}" class="md:block bg-white shadow-lg rounded-lg p-4">
                <h2 class="text-xl font-semibold mb-4">Filters</h2>
                <input v-model="search" type="text" placeholder="Search by Title" class="w-full p-2 border rounded mb-4">
                <h3 class="text-lg font-semibold mb-2">Categories</h3>
                <div v-for="category in categorys" :key="category.categoryName" class="mb-2">
                  <label class="inline-flex items-center">
                    <input type="checkbox" :value="category.categoryName" v-model="selectedCategories" class="form-checkbox">
                    <span class="ml-2">{{ category.categoryName }}</span>
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Books Section -->
            <div class="w-full md:w-3/4 p-2">
              <div class="flex flex-wrap -mx-2">
                <div v-for="book in paginatedBooks" :key="book._id" class="w-full sm:w-1/2 md:w-1/3 p-2">
                  <div class="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col" style="height: 370px;">
                    <img :src="getBookImage(book)" alt="Book Image" class="w-full h-48 object-cover">
                    <div class="p-4 flex-1 flex flex-col">
                      <div class="flex-1">
                        <h2 class="text-lg font-semibold truncate">{{ book.title }}</h2>
                        <h3 class="text-sm font-medium text-gray-600 truncate">{{ book.author }}</h3>
                        <p class="text-sm text-gray-600 truncate"><strong>ISBN:</strong> {{ book.isbn }}</p>
                      </div>
                      <div class="mt-4 flex justify-between items-center">
                        <button @click="toggleFavorite(book)" class="text-red-500">
                          <i :class="book.isFavorite ? 'mdi mdi-heart' : 'mdi mdi-heart-outline'"></i>
                        </button>
                        <button @click="exploreBook(book)" class="bg-purple-500 text-white px-4 py-2 rounded">Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Pagination Controls -->
              <div class="flex justify-center mt-4">
                <button @click="prevPage" :disabled="currentPage === 1" class="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 disabled:opacity-50">Previous</button>
                <span class="mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2 disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Sidebar from '@/components/Sidebar.vue';
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import router from '@/router';
import defaultBookImage1 from '@/assets/Library/default-book-image.jpg';
import defaultBookImage2 from '@/assets/Library/default-book-image-2.jpg';

export default {
  components: {
    Sidebar,
    Footer,
    Header
  },
  data() {
    return {
      search: '',
      selectedCategories: [],
      drawer:false,
      defaultBookImages: [
        defaultBookImage1,
        defaultBookImage2
      ],
      currentPage: 1,
      itemsPerPage: 9,
      filtersVisible: false
    };
  },
  computed: {
    ...mapGetters('book', ['loading', 'error', 'books']),
    ...mapGetters('category', ['loading', 'error', 'categorys']),
    categories() {
      return [...new Set(this.books.map(book => book.category))];
    },
    filteredBooks() {
      return this.books.filter(book => {
        const matchesTitle = book.title.toLowerCase().includes(this.search.toLowerCase());
        const matchesCategory = this.selectedCategories.length === 0 || this.selectedCategories.includes(book.category);
        return matchesTitle && matchesCategory;
      });
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.filteredBooks.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
    }
  },
  created() {
    this.fetchBooks();
    this.fetchCategorys();
  },
  methods: {
    ...mapActions('book', ['getAllBooks']),
    ...mapActions('category', ['getAllCategorys']),
    fetchBooks() {
      this.getAllBooks();
    },
    fetchCategorys() {
      this.getAllCategorys();
    },
    toggleFavorite(book) {
      book.isFavorite = !book.isFavorite;
    },
    exploreBook(book) {
      router.push({ path: `/bookDetails/${book._id}` });
    },
    getBookImage(book) {
      if (book.image) {
        return book.image;
      } else {
        const randomIndex = Math.floor(Math.random() * this.defaultBookImages.length);
        return this.defaultBookImages[randomIndex];
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    toggleFilters() {
      this.filtersVisible = !this.filtersVisible;
    },
    toggleSidebar() {
      this.drawer = !this.drawer;
    },
  }
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
</style>

