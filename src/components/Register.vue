<template>

  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm12 md8>
        <v-card class="elevation-12 ">
          <v-toolbar
            color="primary"
            dark
            flat
          >
            <v-toolbar-title>Register</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
            </v-tooltip>
          </v-toolbar>
          <v-form
            ref="form"
            v-model="valid"
            :lazy-validation="false"
            class="pa-4"
          >
            <v-text-field
              v-model="name"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>

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

            <v-text-field
              v-model="city"
              label="City"
            ></v-text-field>

            <v-text-field
              v-model="country"
              label="Country"
            ></v-text-field>

            <input
              type="file"
              style="display:none"
              ref="fileInput"
              accept="image/jpeg"
              @change="onFilePicked">

            <div v-if="imageUrl !==''">
              <img :src="imageUrl" height="150">
              <br>
            </div>
            <v-btn color="primary" text @click="onPickFile" text>Upload profile picture</v-btn>

            <h4 id="error" v-if="hasError">{{errorMessage}}</h4>

          </v-form>
          <v-card-actions class="px-4">
            <v-btn color="primary" @click="registerUser">Register</v-btn>
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
    name: "Register",
    data() {
      return {
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        nameRules: [
          v => !!v || 'Name is required'
        ],
        passwordRules: [
          v => !!v || 'Password is required'
        ],
        showPassword: false,
        name: "",
        email: "",
        password: "",
        city: "",
        country: "",
        valid: false,
        errorMessage: "",
        hasError: false,
        image: null,
        imageUrl: ""
      }
    },
    methods: {
      createUser() {
        let user = {
          "name": this.name,
          "email": this.email,
          "password": this.password,
        }
        if (this.country !== "") {
          user.country = this.country
        }
        if (this.city !== "") {
          user.city = this.city
        }
        return user
      },
      onFilePicked(event) {
        console.log("file picked")
        const files = event.target.files
        let filename = files[0].name
        if (filename.lastIndexOf('.') <= 0) {
          return
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.imageUrl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.image = files[0]
      },
      onPickFile() {
        this.$refs.fileInput.click()
      },
      registerUser() {
        if (!this.valid || this.image == null) {
          this.hasError = true
          this.errorMessage = "Please fill in all required fields and a photo"
          return
        }
        const user = this.createUser()
        api.registerUser(user)
          .then(() => this.loginUser())
          .catch((error) => {
            this.errorMessage = "Error registering user"
            if (error.response.statusText) {
              this.errorMessage = error.response.statusText
            }
            this.hasError = true
          })


      },
      setUserImage(userId) {
        const formData = new FormData()
        formData.append('image', this.image)
        api.addUserImageAWS(userId, formData)
          .catch(error => console.log(error))
      },
      loginUser() {
        api.loginUser({"email": this.email, "password": this.password})
          .then((response) => {
            sessionStorage.setItem('token', response.data.token)
            sessionStorage.setItem('userId', response.data.userId)
            router.push('/')

            let payload = {'token': response.data.token, 'userId': response.data.userId}
            store.dispatch('login', payload).then()
            {
              this.setUserImage(response.data.userId)
            }
          })
      }
    }
  }
</script>

<style scoped>
  #error {
    color: red;
  }
</style>
