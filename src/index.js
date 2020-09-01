import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  state: {
    token: null,
    userId: null,
    authenticationStatus: sessionStorage.getItem("token"),
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER_ID(state, userId) {
      state.userId = userId
    },
    SET_AUTHENTICATION_STATUS(state, authenticationStatus){
      state.authenticationStatus =  authenticationStatus
    },
  },
  getters: {
    getAuthenticationStatus: state => {
      return !(state.authenticationStatus === null || state.authenticationStatus === false);
    },
    getUserId: state => {
      return state.userId
    },
  },
  actions: {
    async login({commit}, payload) {
      const token = payload.token
      const userId = payload.userId
      const authenticationStatus = true
      commit('SET_TOKEN', token)
      commit('SET_USER_ID', userId)
      commit('SET_AUTHENTICATION_STATUS', authenticationStatus)
    },
    logout({commit}, payload) {
      const token = payload.token
      const userId = payload.userId
      const authenticationStatus = payload.authenticationStatus
      commit('SET_TOKEN', token)
      commit('SET_USER_ID', userId)
      commit('SET_AUTHENTICATION_STATUS', authenticationStatus)
    },
  }
})
