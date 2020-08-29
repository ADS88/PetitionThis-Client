<template>
  <div>
    <v-expansion-panels id="searchbar" class="py-3" >
      <v-expansion-panel >
        <v-expansion-panel-header >
          Filters
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <form @submit.prevent class="py-3">
            <v-text-field v-model="searchParam" outline label="Petition name"
                          append-icon="search">
            </v-text-field>
            <v-select
              v-model="sortBy"
              :items="sortItems"
              item-text="filter"
              item-value="code"
              label="Sort by"
              outlined
            ></v-select>

            <v-select
              v-model="categoryParam"
              :items="petitionCategories"
              item-text="name"
              item-value="categoryId"
              label="Category"
              outlined
            ></v-select>

            <v-checkbox v-if="isAuthenticated" v-model="onlyCurrentUserPetitions" label="Show only my petitions"></v-checkbox>

            <v-btn @click="updatePetitions" color="primary">Search</v-btn>
          </form>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
  import api from "../api";

  export default {
    name: "FilterMenu",
    data() {
      return {
        sortItems: [
          {filter: 'Signatures descending', code: 'SIGNATURES_DESC'},
          {filter: 'Signatures ascending', code: 'SIGNATURES_ASC'},
          {filter: 'Alphabetical ascending', code: 'ALPHABETICAL_ASC'},
          {filter: 'Alphabetical descending', code: 'ALPHABETICAL_DESC'},
        ],
        sortBy: 'SIGNATURES_DESC',
        searchParam: "",
        categoryParam: -1,
        petitionCategories: [],
        onlyCurrentUserPetitions: false,
      }
    },
    computed: {
      isAuthenticated: function () {
        return sessionStorage.getItem("userId") !== null
      }
    },
    methods: {
      getCategories() {
        api.getPetitionCategories()
          .then((response) => {
            this.petitionCategories = response.data
            this.petitionCategories.unshift({"categoryId": -1, "name": "All"})
          })
          .catch(error => console.log(error))
      },
      updatePetitions() {
        let params = {"sortBy": this.sortBy}
        if(this.searchParam !== ""){
          params.q = this.searchParam
        }
        if(this.categoryParam !== -1){
          params.categoryId = this.categoryParam
        }
        if(this.onlyCurrentUserPetitions && this.isAuthenticated){
          params.authorId = sessionStorage.getItem("userId")
        }
        this.$parent.searchPetitions(params)
      }
    },
    mounted() {
      this.getCategories()
    }
  }
</script>

<style scoped>
  #searchbar {
    max-width: 800px;
    margin: auto;
  }
</style>
