<template>
  <div>
    <vs-topbar vs-color="primary" class="menu">

      <div class="homehelper-topbar">
        <vs-button
          vs-type="dark-flat"
          vs-icon="menu"
          @click="showSidebar = true"
        >
        </vs-button>
        
        <h4 class="ml-15 mr-15">Home helper</h4>
        
        <vs-avatar v-if="userName" vs-size="small" :vs-text="userName"/>

        <div class="topbar-buttons">
          <vs-button
            vs-color-text="rgb(255, 255, 255)"
            vs-color="rgba(255, 255, 255, 0.3)"
            vs-type="flat"
            class="topbar-button"
            :vs-active="actives == 'home'"
            @click="selectMenuItem('home', '/')"
          >
            Главная
          </vs-button>
      
          <vs-button
            vs-color-text="rgb(255, 255, 255)"
            vs-color="rgba(255, 255, 255, 0.3)"
            vs-type="flat"
            class="topbar-button"
            :vs-active="actives == 'issues'"
            @click="selectMenuItem('issues', '/Issues')"
          >
            Заявки
          </vs-button>

          <vs-button
            vs-color-text="rgb(255, 255, 255)"
            vs-color="rgba(255, 255, 255, 0.3)"
            vs-type="flat"
            class="topbar-button"
            :vs-active="actives == 'masters'"
            @click="selectMenuItem('masters', '/masters')"
          >
            Мастера
          </vs-button>

          <vs-button
            v-if="isAuth"
            vs-color-text="rgb(255, 255, 255)"
            vs-color="rgba(255, 255, 255, 0.3)"
            vs-type="flat"
            class="topbar-button"
            :vs-active="actives == 'add-issue'"
            @click="selectMenuItem('add-issue', '/add-issue')"
          >
            Оставить заявку
          </vs-button>

          <vs-button
            v-if="isAuth"
            vs-color-text="rgb(255, 255, 255)"
            vs-color="rgba(255, 255, 255, 0.3)"
            vs-type="flat"
            class="topbar-button"
            :vs-active="actives == 'account-settings'"
            @click="selectMenuItem('account-settings', '/account-settings')"
          >
            Настройки аккаунта
          </vs-button>

          <vs-button
            v-if="isAuth"
            vs-color-text="rgb(255, 255, 255)"
            vs-color="rgba(255, 255, 255, 0.3)"
            vs-type="flat"
            class="topbar-button"
            @click="reauth"
          >
            Выйти
          </vs-button>

          <vs-button
            v-else
            vs-color-text="rgb(255, 255, 255)"
            vs-color="rgba(255, 255, 255, 0.3)"
            vs-type="flat"
            class="topbar-button"
            :vs-active="actives == 'login'"
            @click="selectMenuItem('login', '/login')"
          >
            Вход
          </vs-button>
        </div>
      </div>
    </vs-topbar>

    <vs-sidebar :vs-active.sync="showSidebar">

      <vs-sidebar-item
        vs-icon="home"
        :vs-active="actives == 'home'"
        @click="selectMenuItem('home', '/')"
      >
        Главная
      </vs-sidebar-item>

      <vs-sidebar-item
        vs-icon="library_books"
        :vs-active="actives == 'issues'"
        @click="selectMenuItem('issues', '/Issues')"
      >
        Заявки
      </vs-sidebar-item>

      <vs-sidebar-item
        vs-icon="business_center"
        :vs-active="actives == 'masters'"
        @click="selectMenuItem('masters', '/masters')"
      >
        Мастера
      </vs-sidebar-item>

      <vs-sidebar-item
        vs-icon="add_to_photos"
        :vs-active="actives == 'add-issue'"
        @click="selectMenuItem('add-issue', '/add-issue')"
      >
        Оставить заявку
      </vs-sidebar-item>

      <vs-sidebar-item
        vs-icon="card_giftcard"
        :vs-active="actives == 'account-settings'"
        @click="selectMenuItem('account-settings', '/account-settings')"
      >
        Настройки аккаунта
      </vs-sidebar-item>

      <vs-sidebar-item
        v-if="isAuth"
        :vs-active="actives == ''"
        @click="reauth"
      >
        Выход
      </vs-sidebar-item>

      <vs-sidebar-item
        v-else
        :vs-active="actives == 'login'"
        @click="selectMenuItem('login', '/login')"
      >
        Вход
      </vs-sidebar-item>

    </vs-sidebar>
  </div>
</template>

<script>
export default {
  name: 'Topbar',
  data: () => ({
    // Флаг показа бокового меню
    showSidebar: false,

    // Текущий пункт меню
    actives: 'home'
  }),
  computed: {
    // Флаг того что пользователь залогинен
    isAuth() {
      return this.$store.getters.isAuth
    },

    // Имя пользователя
    userName() {
      return this.$store.getters.userName
    }
  },
  methods: {
    // Выбрать пункт меню
    selectMenuItem(menuItem, path) {
      this.actives = menuItem
      this.showSidebar = false
      this.$router.push(path)
    },

    // Реавторизация
    reauth() {
      this.$emit('reauth')
    }
  }
}
</script>

<style scoped>
.homehelper-topbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.topbar-button {
  margin: 0 10px;
}

.menu {
  position: fixed;
  z-index: 10000;
  top: 0;
}

@media only screen and (max-width: 768px){
  .topbar-buttons {
    display: none;
  }

  .homehelper-topbar{
    justify-content: space-between;
  }
}
</style>
