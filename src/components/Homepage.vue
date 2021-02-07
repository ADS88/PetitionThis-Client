<template>
  <div>

    <div v-if="visiblePetitions.length > 0">
      <FilterMenu v-on:updatePetitions="searchPetitions"></FilterMenu>
      <div v-for="petition in visiblePetitions" v-bind:key="petition.petitionId"
           @click="openDetailedPetition(petition.petitionId)">
        <PetitionOverview
          v-bind:petition="petition"
        ></PetitionOverview>
        <br>
      </div>

      <v-pagination
        v-model="currentPage"
        :circle="true"
        :length="length"
        :next-icon="nextIcon"
        :prev-icon="prevIcon"
        :total-visible="totalVisible"
      >
      </v-pagination>
    </div>

    <div v-else>
      <br>
      <v-layout justify-center>
        <h1>Loading Petitions</h1>
      </v-layout>
      <v-layout justify-center>
        <h3>This will take around 10s</h3>
      </v-layout>
      <v-layout justify-center>
        <p>(As this website is hosted on a free tier of Heroku the server needs to start each time)</p>
      </v-layout>
      <br>
      <v-layout justify-center>
        <v-progress-circular
          indeterminate
          color="green"
          :size="200"
        ></v-progress-circular>
      </v-layout>

    </div>
  </div>
</template>

<script>
  import router from "../routes";
  import api from "../api";
  import PetitionOverview from "./PetitionOverview";
  import FilterMenu from "./FilterMenu";


  export default {
    name: "Homepage",
    components: {FilterMenu, PetitionOverview},
    computed: {
      visiblePetitions: function () {
        const startIndex = (this.currentPage - 1) * this.totalVisible
        const endIndex = startIndex + this.totalVisible
        return this.allPetitions.slice(startIndex, endIndex)
      },
      length: function () {
        return Math.ceil(this.allPetitions.length / this.totalVisible)
      }
    },
    data() {
      return {
        allPetitions: [],
        nextIcon: 'navigate_next',
        nextIcons: ['mdi-chevron-right', 'mdi-arrow-right', 'mdi-menu-right'],
        prevIcon: 'navigate_before',
        prevIcons: ['mdi-chevron-left', 'mdi-arrow-left', 'mdi-menu-left'],
        currentPage: 1,
        totalVisible: 10,
      }
    },
    methods: {
      getPetitions() {
        api.getPetitions()
          .then(response => this.allPetitions = response.data)
          .catch(error => console.log(error))
      },
      searchPetitions(params) {
        api.getPetitions(params)
          .then((response) => {
            this.allPetitions = response.data
            this.currentPage = 1
          })
      },
      openDetailedPetition(id) {
        router.push('Petition/' + id)
      }
    },

    mounted() {
      window.setTimeout(this.getPetitions, 10000)
      //this.getPetitions()
    },
  }
</script>

<style scoped>

</style>
