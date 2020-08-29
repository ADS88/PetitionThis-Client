import Vue from 'vue'
import App from './App.vue'
import vuetify from "./vuetify";
import axios from 'axios'
import Vuex from'vuex'
import VueRouter from 'vue-router';
import router from "./routes.js";


Vue.prototype.$http = axios
Vue.use(VueRouter);
Vue.use(Vuex)


new Vue({
  el: '#app',
  vuetify,
  render: h => h(App),
  router
})
