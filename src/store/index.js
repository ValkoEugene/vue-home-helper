import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
  },
  getters: {
    isAuth: state => {
      return !!state.user
    },

    isMaster: (state, getters) => {
      return getters.isAuth && state.user.accountType === 'master'
    },

    userId: (state, getters) => {
      return getters.isAuth && state.user.uid
    },

    userName: (state, getters) => {
      return  getters.isAuth && (state.user.name || state.user.email)
    },

    userPhone: (state, getters) => {
      return getters.isMaster && state.user.phone
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    }
  }
})

export default store