<template>
  <div id="app">
    <v-app id="inspire">

      <Navbar></Navbar>
      <!-- Sizes your content based upon application components -->
      <v-content>

        <!-- Provides the application the proper gutter -->
        <v-container fluid>
          <!-- If using vue-router -->
          <router-view></router-view>
        </v-container>
      </v-content>

      <v-footer app>
        <!-- -->
      </v-footer>
    </v-app>
  </div>
</template>


<script>
  import PetitionOverview from "./components/PetitionOverview";
  import Navbar from "./components/Navbar";

  export default {
    name: 'app',
    components: {Navbar, PetitionOverview},
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
  }
</script>


<style>
</style>
