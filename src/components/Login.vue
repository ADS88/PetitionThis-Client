<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12 ">
          <v-toolbar
            color="primary"
            dark
            flat
          >
            <v-toolbar-title>Login</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
            </v-tooltip>
          </v-toolbar>
          <v-form
            ref="form"
            v-model="valid"
            :lazy-validation="lazy"
            class="pa-4"
          >
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              autocomplete="current-password"
              :rules="passwordRules"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              required
            ></v-text-field>
            <h4 id="error" v-if="failedLogin">Incorrect email or password!</h4>
          </v-form>
          <v-card-actions class="px-4">
            <v-btn @click="login" color="primary">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import api from "../api"
  import router from "../routes";
  import store from "../index";

  export default {
    name: "Login",
    data() {
      return {
        email: "",
        password: "",
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        passwordRules: [
          v => !!v || 'Password is required'
        ],
        valid: false,
        failedLogin: false,
      }
    },
    methods: {
      login() {
        if (this.valid) {
          api.loginUser({"email": this.email, "password": this.password})
            .then((response) =>{

              sessionStorage.setItem('token', response.data.token)
              sessionStorage.setItem('userId', response.data.userId)

              let payload = {'token': response.data.token, 'userId': response.data.userId}
              store.dispatch('login', payload).then()
              router.push('/')
            })
            .catch((error) => {
              console.log(error)
              this.failedLogin = true;
            })
        }
      }
    }
  }
</script>

<style scoped>
  #error {
    color: red;
  }
</style>
