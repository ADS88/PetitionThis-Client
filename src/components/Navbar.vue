<template>
  <nav>
    <v-toolbar app>
      <v-toolbar-title>
        <router-link :to="{name: 'homepage'}" tag="div" id="homelink">
          <span class="font-weight-light">Petition<strong>This</strong></span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="hidden-sm-and-down">
        <div v-if="store.getters.getAuthenticationStatus">
          <v-btn text to="/CreatePetition">
            <span>Create Petition</span>
          </v-btn>
          <v-btn text class="mx-3" to="/Profile">
            <span>Profile</span>
          </v-btn>
          <v-btn text @click="logout" to="/">
            <span>Logout</span>
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
      </div>
    </v-toolbar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      right
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-title>Create Petition</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Log out</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
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
        drawer: false,
        group: null,
      }
    },
    methods: {
      logout() {
        sessionStorage.clear()
        let payload = {'token': null, 'userId': null, 'authenticationStatus': false}
        store.dispatch('logout', payload, {root: true});
        router.push('/Login');
      }
    },
    watch: {
      group() {
        this.drawer = false
      },
    },
  }
</script>

<style scoped>
  #homelink {
    cursor: pointer;
  }

</style>
