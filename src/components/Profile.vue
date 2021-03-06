<template>
  <div>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm12 md8>
          <v-card class="elevation-12 ">
            <v-toolbar
              color="primary"
              dark
              flat
            >
              <v-toolbar-title>Profile</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
              </v-tooltip>
            </v-toolbar>
            <v-form
              ref="form"
              :lazy-validation="false"
              class="pa-4"
              v-model="valid"
            >
              <v-text-field
                v-model="profile.name"
                label="Name"
                :rules="nameRules"
                v-bind:disabled="!isEditing"
                required
              ></v-text-field>
              <v-text-field
                v-model="profile.email"
                label="Email"
                :rules="emailRules"
                v-bind:disabled="!isEditing"
                required
              ></v-text-field>

              <v-text-field
                v-model="profile.city"
                label="City"
                v-bind:disabled="!isEditing"
                required
              ></v-text-field>
              <v-text-field
                v-model="profile.country"
                label="Country"
                v-bind:disabled="!isEditing"
                required
              ></v-text-field>

              <input
                type="file"
                style="display:none"
                ref="fileInput"
                accept="image/jpeg"
                @change="onFilePicked">

              <div>
                <v-img
                  max-height="150"
                  max-width="150"
                  class="white--text align-end"
                  :src="imageUrl"
                  lazy-src="https://ramcotubular.com/wp-content/uploads/default-avatar.jpg"
                >
                </v-img>

                <br>
              </div>

              <v-btn v-if="isEditing" color="primary" text @click="onPickFile">Change profile picture</v-btn>

              <div v-if="isEditing">
                <br>
                <h4>Only fill these if changing password</h4>
                <v-text-field
                  v-model="currentPassword"
                  label="Current password"
                  required
                  :type="showPassword ? 'text' : 'password'"
                ></v-text-field>
                <v-text-field
                  v-model="newPassword"
                  label="New password"
                  required
                  :type="showPassword ? 'text' : 'password'"
                ></v-text-field>
                <br>
              </div>

              <div v-if="isEditing">
                <v-btn color="primary" @click="saveChanges">Save</v-btn>
                <v-btn color="error" class="mx-3" @click="cancelChanges">Cancel</v-btn>
              </div>
              <div v-else>
                <v-btn @click="beginEditing">Edit</v-btn>
              </div>
              <p id="error" v-if="error">{{errorMessage}}</p>
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import api from "../api";
  import awsRootUrl from "../awsRootUrl";

  export default {
    name: "Profile",
    data() {
      return {
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        nameRules: [
          v => !!v || 'Name is required'
        ],
        userId: sessionStorage.getItem("userId"),
        profile: {},
        originalProfile: {},
        currentPassword: "",
        newPassword: "",
        isEditing: false,
        valid: false,
        error: false,
        showPassword: false,
        errorMessage: "Error saving edited profile",
        image: null,
        changedProfilePicture: false,
        imageUrl: `${awsRootUrl}/user${sessionStorage.getItem("userId")}.jpg`
      }
    },
    mounted() {
      this.getProfile()
    },
    methods: {
      saveChanges() {
        if(!this.valid){
          this.errorMessage = "Please fill out all required fields"
          this.error = true
          return
        }

        const editRequest = this.createRequest()
        this.updateProfilePicture()
        if (Object.keys(editRequest).length === 0) {
          this.isEditing = false
          this.error = false
          return
        }
        api.editUser(editRequest)
          .then(() => {
            this.isEditing = false;
            this.error = false
            this.getProfile()
          })
          .catch((error) => {
            this.errorMessage = "Error registering user"
            if (error.response.statusText) {
              this.errorMessage = error.response.statusText
            }
            this.error = true})
      },
      createRequest(){
        let editRequest = {}

        if(this.profile.name !== this.originalProfile.name){
          editRequest.name = this.profile.name
        }

        if(this.profile.email !== this.originalProfile.email){
          editRequest.email = this.profile.email
        }

        if (this.profile.city) {
          editRequest.city = this.profile.city
        }
        if (this.profile.country) {
          editRequest.country = this.profile.country
        }

        if (this.currentPassword !== "") {
          editRequest.currentPassword = this.currentPassword
        }

        if (this.newPassword !== "") {
          editRequest.password = this.newPassword
        }

        if (this.profile.country) {
          editRequest.country = this.profile.country
        }
        return editRequest
      },
      beginEditing() {
        this.isEditing = true;
      },
      getProfile(){
        api.getUser()
          .then((response) => {
            this.profile = response.data
            let originalProfile = {...response.data}
            this.originalProfile = originalProfile
          })
      },
      //Fix this to use AWS
      updateProfilePicture(){
        if(this.changedProfilePicture){
            const formData = new FormData()
            const userId = sessionStorage.getItem("userId")
            formData.append('image', this.image)
            api.addUserImageAWS(userId, formData)
          }
      },
      cancelChanges() {
        this.imageUrl = `${awsRootUrl}/user${sessionStorage.getItem("userId")}.jpg`
        this.isEditing = false;
        this.error = false
        this.getProfile()
      },
      onFilePicked(event) {
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
        this.changedProfilePicture = true
      },
      onPickFile() {
        this.$refs.fileInput.click()
      },
    }
  }

</script>

<style scoped>
  #error {
    color: red;
    margin: 1rem 0;
  }
</style>
