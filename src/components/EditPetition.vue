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
            <v-toolbar-title>Edit petition</v-toolbar-title>
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
              v-model="petition.title"
              :rules="nameRules"
              label="Title"
              required
            ></v-text-field>

            <v-text-field
              v-model="petition.description"
              :rules="descriptionRules"
              label="Description"
              required
            ></v-text-field>

            <v-select
              v-model="petition.category"
              :items="petitionCategories"
              item-text="name"
              :rules="categoryRules"
              item-value="categoryId"
              label="Category"
              outlined
            ></v-select>

            <p>Closing date</p>
            <input type="date" v-model="petition.closingDate">
            <br>
            <br>

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
            <v-btn @click="onPickFile" text>Change image</v-btn>


          </v-form>
          <v-card-actions class="px-4">
            <v-btn color="primary" @click="updatePetition">Save</v-btn>
            <v-btn color="error" @click="cancelUpdate">Cancel</v-btn>
          </v-card-actions>
          <h4 id="error" v-if="error">{{errorMessage}}</h4>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import api from "../api";
  import router from "../routes";
  import awsRootUrl from "../awsRootUrl";

  export default {
    name: "EditPetition",
    props: ["id"],
    data() {
      return {
        valid: false,
        image: null,
        error: false,
        errorMessage: "",
        newImageUrl: null,
        petition: {},
        petitionCategories: [],
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
    computed: {
      imageUrl: function () {
        if (this.newImageUrl) {
          return this.newImageUrl
        }
        return `${awsRootUrl}/petition${this.petition.petitionId}.jpg`
      },
    },
    methods: {
      onFilePicked(event) {
        console.log("file picked")
        const files = event.target.files
        let filename = files[0].name
        if (filename.lastIndexOf('.') <= 0) {
          return
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.newImageUrl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.image = files[0]
      },
      onPickFile() {
        this.$refs.fileInput.click()
      },
      getPetition() {
        api.getDetailedPetiton(this.id).then((response) => {
          this.petition = response.data
          //Format date from utc to time accepted by frontend js
          if(response.data.closingDate){
           this.petition.closingDate = response.data.closingDate.slice(0,10)
          }
        }).finally(() => this.getCategories())
      },
      getCategories() {
        api.getPetitionCategories()
          .then((response) => {
            this.petitionCategories = response.data
            this.petition.category = this.getCategoryFromName(this.petitionCategories, this.petition.category)
          })
          .catch(error => console.log(error))
      },
      cancelUpdate() {
        router.go(-1)
      },
      getCategoryFromName(categories, name){
        let categoryId = -1;
        console.log(name)
        console.log(categories)
        for(let i = 0; i < categories.length; i++){
          console.log(categories[i])
          if(categories[i].name === name){
            categoryId = categories[i].categoryId
          }
        }
        return categoryId
      },
      async updatePetition() {
        if (!this.valid) {
          this.error = true
          this.errorMessage = "Required fields are not filled correctly"
          return
        }
        let editData = {
          "title": this.petition.title,
          "description": this.petition.description,
          "categoryId": this.petition.category
        }

        if (this.petition.closingDate) {
          editData.closingDate = this.petition.closingDate
        }

        try {
          await api.editPetition(this.id, editData)
          if (this.image !== null) {
            await this.updatePetitionImage()
          }
          router.go(-1)
        } catch (err) {
          this.error = true;
          this.errorMessage = "Invalid petition entered!"
        }
      },
      async updatePetitionImage() {
        const formData = new FormData()
        formData.append('image', this.image)
        await api.addPetitionImageAWS(this.id, formData)
      },

    },
    mounted() {
      this.getPetition()
    },
  }
</script>

<style scoped>
  #error {
    color: red;
    padding: 1rem;
  }
</style>
