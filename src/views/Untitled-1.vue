<template>
  <div>
    <v-progress-linear color="green" indeterminate v-if="loading"></v-progress-linear>
    <v-app>
      <Sidebar />
      <v-main>
        <v-container>
          <v-row>
            <v-col>
              <v-btn @click="fetchBooks">Fetch All Books</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                :headers="headers"
                :items="books"
                :loading="loading"
                item-key="_id"
                class="elevation-1"
              >
                <template v-slot:items="props">
                  <td>{{ props.item.title }}</td>
                  <td>{{ props.item.author }}</td>
                  <td>{{ props.item.description }}</td>
                  <td class="text-right">
                    <v-btn small color="blue" @click="editBook(props.item)">
                      Edit
                    </v-btn>
                    <v-btn small color="red" @click="deleteBook(props.item)">
                      Delete
                    </v-btn>
                  </td>
                </template>
                <template v-slot:no-data>
                  <v-alert v-if="error" type="error">
                    {{ error }}
                  </v-alert>
                  <v-alert v-else type="info">
                    No books found.
                  </v-alert>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
        <Footer />
      </v-main>
    </v-app>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Sidebar from '@/components/Sidebar.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Sidebar,
    Footer,
  },
  computed: {
    ...mapGetters('book', ['loading', 'error', 'books'])
  },
  methods: {
    ...mapActions('book', ['getAllBooks', 'deleteBook']),
    fetchBooks() {
      this.getAllBooks();
    },
    editBook(book) {
      // Implement your edit functionality here
      console.log('Editing book:', book);
    },
    deleteBook(book) {
      // Implement your delete functionality here
      if (confirm(`Are you sure you want to delete ${book.title}?`)) {
        this.deleteBook(book._id); // Assuming you have a deleteBook action in Vuex
      }
    }
  },
  created() {
    this.fetchBooks();
  },
  data() {
    return {
      headers: [
        { text: 'Title', value: 'title' },
        { text: 'Author', value: 'author' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>