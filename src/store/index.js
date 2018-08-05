import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
  },
  getters: {
    isMaster: state => {
      return !!(state.user && state.user.accountType === 'master')
    },

    userId: state => {
      return state.user && state.user.uid
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    }
  }
})

export default store