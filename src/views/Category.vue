<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <Sidebar />
    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-y-auto">
      <Header />

      <div class="p-8">
        <div class="flex justify-center">
          <div class="w-full md:w-3/4 lg:w-2/3">
            <!-- Category Form Card -->
            <div class="bg-white shadow-lg rounded-lg p-8 mb-8">
              <h2 class="text-2xl font-bold mb-6">Manage Categories</h2>
              <form ref="form" @submit.prevent="submitForm" class="space-y-6">
                <div>
                  <label class="block text-md font-medium text-gray-700">New Category</label>
                  <div class="mt-2 relative rounded-md shadow-sm">
                    <input v-model="categoryName" type="text" class="form-input block w-full pl-12 pr-10 py-3 text-md border-gray-300 rounded-md" placeholder="New Category">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500">
                        <i class="mdi mdi-dns text-lg mr-12"></i>
                      </span>
                    </div>
                  </div>
                  <span v-if="!categoryName" class="text-red-600 text-sm mt-2">Category name is required</span>
                </div>
                <button type="submit" :disabled="!isFormValid" class="w-full bg-purple-600 text-white py-3 px-4 rounded-md text-md hover:bg-purple-500">Add Category</button>
              </form>
            </div>

            <!-- Existing Categories Card -->
            <div class="bg-white shadow-lg rounded-lg p-8">
              <h2 class="text-2xl font-bold mb-6">Existing Categories</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div v-for="category in categorys" :key="category._id" class="bg-gray-100 p-6 rounded-lg shadow">
                  <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold truncate">{{ category.categoryName }}</h3>
                    <div class="flex space-x-2">
                      <button @click="openEditDialog(category)" class="text-blue-600 hover:text-blue-800">
                        <i class="mdi mdi-pencil text-lg"></i>
                      </button>
                      <button @click="openConfirmDeleteDialog(category._id)" class="text-red-600 hover:text-red-800">
                        <i class="mdi mdi-delete-outline text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <transition name="fade">
      <div v-if="showConfirmDialog" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold mb-4">Confirm Deletion</h3>
          <p>Are you sure you want to delete this category?</p>
          <div class="mt-4 flex justify-end">
            <button @click="confirmDelete" class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-500">Delete</button>
            <button @click="cancelDelete" class="ml-4 bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-200">Cancel</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Edit Dialog -->
    <transition name="fade">
      <div v-if="showEditDialog" class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold mb-4">Edit Category</h3>
          <form @submit.prevent="confirmUpdateCategory" class="space-y-4">
            <div>
              <label class="block text-md font-medium text-gray-700">Category Name</label>
              <input v-model="editCategoryName" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-shadow duration-300 ease-in-out" placeholder="Shelf No">
              <span v-if="!editCategoryName" class="text-red-600 text-sm mt-2">Category name is required</span>
            </div>
            <div class="mt-4 flex justify-end">
              <button type="submit" :disabled="!editCategoryName" class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500">Save</button>
              <button @click="cancelEdit" class="ml-4 bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-200">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import Header from '@/components/Header.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    Sidebar,
    Header,
  },
  data() {
    return {
      categoryName: '',
      isFormValid: false,
      showConfirmDialog: false,
      showEditDialog: false,
      categoryToDelete: null,
      categoryToEdit: null,
      categoryData: {
        categoryName: '',
      },
      editCategoryName: '',
      optimisticCategoryState: [], // For optimistic UI updates
    };
  },
  watch: {
    categoryName(value) {
      this.isFormValid = !!value;
    },
    editCategoryName(value) {
      // This validation might be useful for enabling/disabling buttons in the edit dialog
    },
  },
  computed: {
    ...mapGetters('category', ['loading', 'error', 'categorys']),
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    ...mapActions('category', ['getAllCategorys', 'addCategory', 'deleteCategory', 'updateCategory']),
    fetchCategories() {
      this.getAllCategorys();
    },
    submitForm() {
      if (this.isFormValid) {
        this.addCategorys();
      }
    },
    addCategorys() {
      this.addCategory({
        categoryName: this.categoryName,
      }).then(() => {
        this.categoryName = ''; // Clear the input field
        this.fetchCategories();
      });
    },
    openConfirmDeleteDialog(categoryId) {
      this.categoryToDelete = categoryId;
      this.showConfirmDialog = true;
    },
    async confirmDelete() {
      if (!this.categoryToDelete) return;

      // Optimistically remove the item from the UI
      const originalCategories = [...this.categorys];
      this.optimisticCategoryState = originalCategories.filter((cat) => cat._id !== this.categoryToDelete);

      try {
        // Attempt to delete the item from the server
        await this.deleteCategory(this.categoryToDelete);
        // Since Vuex should automatically update `categorys`, there's no need to manually update it here
        this.fetchCategories(); // Refresh the category list after deletion
      } catch (error) {
        // If there is an error, re-add the item to the UI
        this.optimisticCategoryState.forEach((cat) => {
          if (cat._id === this.categoryToDelete) {
            this.categorys.push(cat);
          }
        });
        console.error('Error deleting category:', error);
      } finally {
        this.showConfirmDialog = false; // Close the dialog
        this.categoryToDelete = null;
      }
    },
    cancelDelete() {
      this.showConfirmDialog = false; // Close the dialog
      this.categoryToDelete = null;
    },
    openEditDialog(category) {
      this.categoryToEdit = category;
      this.editCategoryName = category.categoryName;
      this.showEditDialog = true;
    },
    async confirmUpdateCategory() {
      if (!this.editCategoryName) return;

      const updatedCategory = { ...this.categoryToEdit, categoryName: this.editCategoryName };

      try {
        await this.updateCategory({
          id: this.categoryToEdit._id,
          categoryData: updatedCategory,
        });
        this.fetchCategories(); // Refresh the category list after update
      } catch (error) {
        console.error('Error updating category:', error);
      } finally {
        this.showEditDialog = false; // Close the dialog
        this.categoryToEdit = null;
        this.editCategoryName = '';
      }
    },
    cancelEdit() {
      this.showEditDialog = false; // Close the dialog
      this.categoryToEdit = null;
      this.editCategoryName = '';
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
