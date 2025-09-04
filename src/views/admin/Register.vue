<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <span class="headline">Register</span>
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="performRegister">
              <v-text-field
                v-model="name"
                label="Name"
                type="text"
                required
              ></v-text-field>
              <v-text-field
                v-model="username"
                label="Username"
                type="username"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" :loading="loading" block>
                Register
              </v-btn>
              <v-alert v-if="error" type="error" class="mt-3">
                {{ error }}
              </v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      name: "",
      username: "",
      password: "",
    };
  },
  computed: {
    ...mapGetters("auth", ["loading", "error"]),
  },
  methods: {
    ...mapActions("auth", ["register"]),
    performRegister() {
      // if (this.username || this.password || this.name == "") {
      //   return;
      // }
      console.log("Registering user:", this.name, this.username);

      this.register({
        name: this.name,
        username: this.username,
        password: this.password,
      });
    },
  },
};
</script>
