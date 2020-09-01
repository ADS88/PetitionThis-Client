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
        <span v-for="action in actions">
          <v-btn
            class="mx-2"
            v-if="action.showWhenLoggedIn === store.getters.getAuthenticationStatus"
            :key="action.name"
            :to="action.to">
            <span>{{action.name}}</span>
          </v-btn>
        </span>
        <v-btn class="mx-2" v-if="store.getters.getAuthenticationStatus" @click="logout">Logout</v-btn>
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
          <div v-for="action in actions">
            <v-list-item
              :to="action.to"
              v-if="action.showWhenLoggedIn === store.getters.getAuthenticationStatus">
              <v-list-item-title>{{action.name}}</v-list-item-title>
            </v-list-item>
          </div>
          <v-list-item v-if="store.getters.getAuthenticationStatus" @click="logout" large>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>

  import store from "../index";
  import router from "../routes";

  export default {
    name: "Navbar",
    data: () => {
      return {
        store: store,
        drawer: false,
        group: null,
        actions: [
          {name: "Create Petition", to: "/CreatePetition", showWhenLoggedIn: true},
          {name: "Profile", to: "/Profile", showWhenLoggedIn: true},
          {name: "Register", to: "/Register", showWhenLoggedIn: false},
          {name: "Login", to: "/Login", showWhenLoggedIn: false}
        ]
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
