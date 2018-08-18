<template>
  <div id="app">

    <topbar @reauth="reauth"/>

    <div class="homehelper-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css';

import './assets/main.css'

import firebase from 'firebase'

Vue.use(Vuesax, {
  theme:{
    colors:{
      primary:'#5b3cc4',
      success:'rgb(23, 201, 100)',
      danger:'rgb(242, 19, 93)',
      warning:'rgb(255, 130, 0)',
      dark:'rgb(36, 33, 69)'
    }
  }
})

import Preloader from './components/Preloader.vue'
Vue.component('preloader', Preloader)

export default {
  name: 'app',
  components: {
    Topbar: () => import('./components/Topbar.vue')
  },
  methods: {
    reauth() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.commit('setUser', null)
          this.$router.push('/login')
        })
        .catch(error => console.log(error))
    }
  }
}
</script>

<style scoped>
.homehelper-content {
  margin-top: 50px;
}
</style>
