<template>
  <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
  </div>

  <div class="min-h-screen flex">
    <Sidebar />
    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-y-auto">
      <Header />

      <main class="p-4">
        <div class="container mx-auto">
          <div class="flex flex-wrap">
            <!-- Filters Section -->
            <div class="w-full md:w-1/4 p-2">
              <div class="md:hidden mb-4 flex justify-end">
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
            <!-- Issues Section -->
            <div class="w-full md:w-3/4 p-2">
              <h1 class="text-3xl font-semibold text-gray-800">My Issued Books</h1><br>
              <div v-if="issues === ''" class="flex flex-wrap mx-2">
                <h1 class="font-semibold text-gray-800">No issue history</h1>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div v-for="issue in paginatedIssues" :key="issue._id" class="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
                  <img :src="getIssueImage(issue)" alt="Issue Image" class="w-full h-48 object-cover">
                  <div class="p-4 flex flex-col flex-1">
                    <div class="flex-1">
                      <h2 class="text-lg font-semibold">{{ issue.bookTitle }}</h2>
                      <h3 class="text-sm font-medium text-gray-600">{{ issue.author }}</h3>
                      <p class="text-sm text-gray-600"><strong>ISBN:</strong> {{ issue.isbn }}</p>
                      <p class="text-sm text-gray-600"><strong>Status:</strong> {{ issue.status }}</p>
                    </div>
                    <div class="mt-4">
                      <button @click="exploreIssue(issue)" class="bg-purple-500 text-white px-4 py-2 rounded w-full">Details</button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Pagination Controls -->
              <div v-if="issues" class="flex justify-center mt-4">
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
        defaultIssueImages: [
          defaultBookImage1,
          defaultBookImage2
        ],
        currentPage: 1,
        itemsPerPage: 9,
        filtersVisible: false
      };
    },
    computed: {
      ...mapGetters('issue', ['loading', 'error', 'issues']),
      ...mapGetters('category', ['loading', 'error', 'categorys']),
      ...mapGetters('auth',['user']),
      categories() {
        return [...new Set(this.issues.map(issue => issue.category))];
      },
      filteredIssues() {
        return this.issues.filter(issue => {
          const matchesTitle = issue.bookTitle.toLowerCase().includes(this.search.toLowerCase());
          const matchesCategory = this.selectedCategories.length === 0 || this.selectedCategories.includes(issue.category);
          return matchesTitle && matchesCategory;
        });
      },
      paginatedIssues() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;
        return this.filteredIssues.slice(start, end);
      },
      totalPages() {
        return Math.ceil(this.filteredIssues.length / this.itemsPerPage);
      }
    },
    created() {
      this.fetchIssues();
      this.fetchCategorys();
    },
    methods: {
      ...mapActions('issue', ['getIssuesByUser']),
      ...mapActions('category', ['getAllCategorys']),
      ...mapActions('auth', ['getCurrentUser']),
      fetchIssues() {
        this.getIssuesByUser(this.user._id);
      },
      fetchCategorys() {
        this.getAllCategorys();
      },
      toggleFavorite(issue) {
        issue.isFavorite = !issue.isFavorite;
      },
      exploreIssue(issue) {
        router.push({ path: `/bookDetails/${issue.bookID}` });
      },
      getIssueImage(issue) {
        if (issue.image) {
          return issue.image;
        } else {
          const randomIndex = Math.floor(Math.random() * this.defaultIssueImages.length);
          return this.defaultIssueImages[randomIndex];
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
      }
    }
  };
  </script>
  
  <style scoped>
  .title-background {
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 10px;
    font-size: 1.25rem;
    font-weight: bold;
    border-radius: 4px;
  }
  </style>
  