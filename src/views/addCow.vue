<template>
  <div v-if="loading" class="bg-green-500 h-1.5 w-full animate-pulse"></div>
  <div class="min-h-screen flex">
    <div class="flex flex-col flex-1 overflow-y-auto">
      <div class="p-4">
        <div
          class="container mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div class="flex justify-center py-4">
            <h2 class="text-3xl font-semibold text-gray-800">Add Book</h2>
          </div>
          <form @submit.prevent="addBooks" class="px-8 py-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Book Title</label
                >
                <input
                  v-model="title"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow duration-300 ease-in-out"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Author</label
                >
                <input
                  v-model="author"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow duration-300 ease-in-out"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Category</label
                >
                <select
                  v-model="selectedCategory"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow duration-300 ease-in-out"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option
                    v-for="category in categorys"
                    :key="category.categoryName"
                    :value="category.categoryName"
                  >
                    {{ category.categoryName }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >ISBN</label
                >
                <input
                  v-model="isbn"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow duration-300 ease-in-out"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Copies Available</label
                >
                <input
                  v-model="maxCopies"
                  type="number"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow duration-300 ease-in-out"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Shelf Number</label
                >
                <input
                  v-model="shelfNo"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow duration-300 ease-in-out"
                  required
                />
              </div>
              <div class="flex items-center">
                <input
                  id="checkbox"
                  v-model="availableForOutsideReaders"
                  type="checkbox"
                  class="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                />
                <label for="checkbox" class="ml-2 text-gray-700"
                  >Available for outside readers.</label
                >
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700"
                  >Description</label
                >
                <textarea
                  v-model="description"
                  rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow duration-300 ease-in-out"
                ></textarea>
              </div>
            </div>
            <div
              v-if="error"
              class="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong class="font-bold">Error:</strong>
              <span class="block sm:inline">{{ error.message }}</span>
            </div>
            <div class="flex justify-center mt-6">
              <button
                type="submit"
                class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Footer from "@/components/Footer.vue";
import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/Header.vue";

export default {
  components: {
    Footer,
    Sidebar,
    Header,
  },
  data() {
    return {
      title: "",
      author: "",
      selectedCategory: "",
      isbn: "",
      maxCopies: "",
      shelfNo: "",
      description: "",
      drawer: false,
      availableForOutsideReaders: true,
    };
  },
  created() {
    this.fetchCategorys();
  },
  computed: {
    ...mapGetters("book", ["loading", "error"]),
    ...mapGetters("category", ["loading", "error", "categorys"]),
  },
  methods: {
    ...mapActions("book", ["addBook"]),
    ...mapActions("category", ["getAllCategorys"]),
    addBooks() {
      this.addBook({
        title: this.title,
        author: this.author,
        category: this.selectedCategory,
        isbn: this.isbn,
        maxCopies: this.maxCopies,
        shelfNo: this.shelfNo,
        availableForOutsideReaders: this.availableForOutsideReaders,
        description: this.description,
      });
    },
    fetchCategorys() {
      this.getAllCategorys();
    },
    toggleSidebar() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style scoped>
/* Custom styling for animation and transitions */
input[type="text"],
textarea {
  transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}
button {
  transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;
}
button:hover,
.hover\:bg-gray-300:hover {
  background-color: #e5e7eb;
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
