<template>
  <nav>
    <v-toolbar app>
      <v-toolbar-title>
        <router-link :to="{name: 'homepage'}" tag="div" id="homelink">
          <span class="font-weight-light">Petition<strong>This</strong></span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-if="store.getters.getAuthenticationStatus">
        <v-btn text to="/CreatePetition">
          <span>Create</span>
        </v-btn>
        <v-btn text class="mx-3" to="/Profile">
          <span>Profile</span>
        </v-btn>
        <v-btn text @click="logout" to="/">
          <span>Log out</span>
        </v-btn>
      </div>
      <div v-else>
        <v-btn text class="mx-3" to="/Login">
          <span>Log in</span>
        </v-btn>
        <v-btn text to="/Register">
          <span>Sign up</span>
        </v-btn>
      </div>
    </v-toolbar>
  </nav>
</template>

<script>

  import store from "../index";
  import router from "../routes";
  // import Vuex from 'vuex';
  // import Vue from "vue";
  // Vue.use(Vuex)

  export default {
    name: "Navbar",
    data: () => {
      return {
        store: store,
      }
    },
    methods: {
      logout() {
        sessionStorage.clear()
        let payload = {'token': null, 'userId': null, 'authenticationStatus': false}
        store.dispatch('logout', payload, {root:true});
        router.push('/Login');
      }
    }
  }
</script>

<style scoped>
  #homelink {
    cursor: pointer;
  }

</style>
