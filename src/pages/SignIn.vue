<template>
  <div class="home-helper__wrapper">
    <router-link to="/login">
      Вход
    </router-link>

    <!-- create user -->
    <div v-if="!userCreate">
      <h1>Регистрация нового аккаунта</h1>

      <vs-input
        vs-label="Email"
        vs-type="text"
        v-model.trim="email"
      />

      <vs-input
        vs-label="Пароль"
        vs-type="password"
        v-model.trim="password"
      />

      <vs-button
        vs-color="primary"
        vs-type="filled"
        @click="signIn"
      >
        Создать аккаунт
      </vs-button>
    </div>
    <!-- /create user -->

    <!-- create user in db -->
    <div v-else>
      <h1>Заполните информацию о себе</h1>

      <vs-input
        vs-label="Имя"
        vs-type="text"
        v-model.trim="name"
      />

      <vs-select
        class="selectExample"
        vs-label="Тип аккаунта"
        v-model="accountType"
      >
        <vs-select-item
          v-for="item in accountTypes"
          :key="item.value"
          :vs-value="item.value"
          :vs-text="item.text"
        />
      </vs-select>

      <vs-button
        vs-color="primary"
        vs-type="filled"
        @click="createUserInBd"
      >
        Сохранить
      </vs-button>
    </div>
    <!-- /create user in db -->

  </div>
</template>

<script>
import firebase from 'firebase'
import db from '../plugins/firebaseInit.js'

export default {
  name: 'SignIn',
  data: () => ({
    email: '',
    password: '',
    name: '',
    accountType: '',
    userId: '',
    accountTypes: [
      { value: 'master', text: 'Мастер' },
      { value: 'client', text: 'Заказчик' }
    ],
    userCreate: false
  }),
  methods: {
    signIn() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(user => {
          console.log(user.user.uid)
          this.userId = user.user.uid
          this.userCreate = true
        })
        .catch(error => console.error('Ooops', error))
    },

    createUserInBd() {
      const data = {
        userId: this.userId,
        name: this.name,
        accountType: this.accountType,
        // userId: this.$store.state.user.uid
      }

      db.collection('users')
        .doc(this.userId)
        .set(data)
        .then(() => {
          this.$store.commit('setUser', Object.assign({}, this.$store.state.user, data))
          this.$router.push('/')
        })
        .catch(error => console.error('Ooops', error))
    }
  }
}
</script>
