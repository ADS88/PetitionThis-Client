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
            <v-toolbar-title>Create Petition</v-toolbar-title>
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
              v-model="title"
              :rules="nameRules"
              label="Title"
              required
            ></v-text-field>

            <v-text-field
              v-model="description"
              :rules="descriptionRules"
              label="Description"
              required
            ></v-text-field>

            <v-select
              v-model="category"
              :items="petitionCategories"
              item-text="name"
              :rules="categoryRules"
              item-value="categoryId"
              label="Category"
              outlined
            ></v-select>

            <p>Closing date</p>
            <input type="date" v-model="closingDate" v-bind:min="today">
            <br>
            <br>

            <input
              type="file"
              style="display:none"
              ref="fileInput"
              accept="image/png,image/jpeg,image/gif"
              @change="onFilePicked">

            <div v-if="imageUrl !==''">
              <img :src="imageUrl" height="150">
              <br>
            </div>
            <v-btn @click="onPickFile">Upload image</v-btn>


            <h4 id="error" v-if="hasError">{{errorMessage}}</h4>

          </v-form>
          <v-card-actions class="px-4">
            <v-btn color="primary" @click="submitPetition">Create</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import api from "../api";
  import router from "../routes";

  export default {
    name: "CreatePetition",
    data() {
      return {
        petitionCategories: [],
        today: new Date().toISOString().substring(0, 10),
        title: "",
        description: "",
        category: "",
        closingDate: "",
        hasError: false,

        imageUrl: "",
        valid: false,
        image: null,
        nameRules: [
          v => !!v || 'Name is required'
        ],
        descriptionRules: [
          v => !!v || 'Description is required'
        ],
        categoryRules: [
          v => !!v || 'Category is required'
        ],
      }
    },
    methods: {
      getCategories() {
        api.getPetitionCategories()
          .then((response) => {
            this.petitionCategories = response.data
          })
          .catch(error => console.log(error))
      },
      onPickFile() {
        this.$refs.fileInput.click()
      },
      submitPetition() {
        if (!this.valid) {
          this.errorMessage = "Please fill in all required fields"
          this.hasError = true
          return
        }
        if (this.image === null) {
          this.errorMessage = "You must upload an image!"
          this.hasError = true
          return
        }
        let petition = {
          "title": this.title,
          "description": this.description,
          "categoryId": this.category
        }
        if (this.closingDate !== "") {
          petition.closingDate = this.closingDate
        }
        api.createPetition(petition)
          .then((response) => {
            const petitionId = response.data.petitionId
            this.signPetition(response.data.petitionId)
            this.addPetitionImage(response.data.petitionId)

            //router.push('/')
          })
          .catch((error) => {
            this.errorMessage = "Error registering user"
            if (error.response.statusText) {
              this.errorMessage = error.response.statusText
            }
            this.hasError = true
          })
      },
      signPetition(petitionId) {
        api.signPetition(petitionId)
      },
      addPetitionImage(petitionId) {
        const formData = new FormData()
        formData.append('image', this.image)
        api.addPetitionImageAWS(petitionId, formData)
        .then(() => router.push('/'))
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
      }
    },
    mounted() {
      this.getCategories();
    }
  }
</script>

<style scoped>
  #error {
    margin-top: 1rem;
    color: red;
  }
</style>
