<template>
  <div class="home-helper__wrapper">
    <h1>Вход</h1>

    <vs-card>
      <vs-card-body>

        <router-link to="/signin">
          Зарегистрироваться
        </router-link>
        

        <vs-input
          vs-label="Email"
          vs-type="text"
          v-model.trim="email"
        />

        <label>Пароль</label>
        <input
          type="password"
          v-model.trim="password"
        />

        <vs-button
          vs-color="primary"
          vs-type="filled"
          @click="login"
        >
          Войти
        </vs-button>
        
      </vs-card-body>
    </vs-card>

  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Login',
  data: () => ({
    email: '',
    password: ''
  }),
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          console.log('user login', user)
          this.$router.replace('/')
        })
        .catch(error => this.$vs.notify({
          title: 'Ошибка при входе',
          text: error.message || error,
          color: 'danger'
        }))
    }
  }
}
</script>
