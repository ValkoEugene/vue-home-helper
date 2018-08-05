<template>
  <div id="app">

    <vs-topbar vs-color="primary" class="menu">
      <div class="homehelper-topbar">
        <h4 class="ml-15 mr-15">Home helper</h4>
        
        <vs-avatar vs-size="small" :vs-text="userName"/>

        <vs-button
          vs-color-text="rgb(255, 255, 255)"
          vs-color="rgba(255, 255, 255, 0.3)"
          vs-type="flat"
          :vs-active="actives == 'home'"
          @click="selectMenuItem('home', '/')"
        >
          Главная
        </vs-button>
    
        <vs-button
          vs-color-text="rgb(255, 255, 255)"
          vs-color="rgba(255, 255, 255, 0.3)"
          vs-type="flat"
          @click="selectMenuItem('issues', '/Issues')"
        >
          Заявки
        </vs-button>

        <vs-button
          vs-color-text="rgb(255, 255, 255)"
          vs-color="rgba(255, 255, 255, 0.3)"
          vs-type="flat"
          @click="selectMenuItem('masters', '/masters')"
        >
          Мастера
        </vs-button>
        <vs-button
          vs-color-text="rgb(255, 255, 255)"
          vs-color="rgba(255, 255, 255, 0.3)"
          vs-type="flat"
          @click="selectMenuItem('add-issue', '/add-issue')"
        >
          Оставить заявку
        </vs-button>
        <vs-button
          vs-color-text="rgb(255, 255, 255)"
          vs-color="rgba(255, 255, 255, 0.3)"
          vs-type="flat"
          :vs-active="actives == 'account-settings'"
          @click="selectMenuItem('account-settings', '/account-settings')"
        >
          Настройки аккаунта
        </vs-button>

        <vs-button
          vs-color-text="rgb(255, 255, 255)"
          vs-color="rgba(255, 255, 255, 0.3)"
          vs-type="flat"
          @click="reauth"
        >
          Выйти
        </vs-button>
      </div>
     </vs-topbar>

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
  data: () => ({
    active: false,

    actives: 'home'
  }),
  computed: {
    userId() {
      return this.$store.state.user.uid
    },

    userName() {
      return this.$store.getters.userName
    }
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
    },

    showNotificacion({ title, text, color = 'primary' }) {
      this.$vs.notify({ title, text, color })
    },
    
    selectMenuItem(menuItem, path) {
      this.actives = menuItem
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.homehelper-content {
  margin-top: 50px;
}

.homehelper-topbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.menu {
  position: fixed;
  z-index: 10000;
  top: 0;
}
</style>
