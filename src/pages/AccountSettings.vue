<!-- Страница с настройками аккаунта -->

<template>
  <div class="home-helper__wrapper">
    <h1>Настройка аккаунта</h1>

    <vs-card>
      <vs-card-body>
    
        <vs-input
          vs-label="Имя"
          vs-type="text"
          v-model.trim="name"
        />

        <label>Возраст</label>
        <vs-input-number size="medium" min="16" max="99" v-model="age"/>

        <vs-input
          vs-label="Город"
          vs-type="text"
          v-model.trim="city"
        />

        <p>О себе</p>
        <textarea v-model.trim="description" rows="5" />

        <template v-if="isMaster">
          <vs-input
            vs-label="Опыт"
            vs-type="text"
            v-model.trim="experience"
          />

          <p>Выды выполняемых работ</p>
          <div>
            <vs-col v-for="type in types" :key="type.id">
              <vs-checkbox v-model="category" :vs-value="type.id" >{{ type.name }}</vs-checkbox>
            </vs-col>
          </div>
        </template>

        <vs-button
          vs-color="primary"
          vs-type="filled"
          @click="updateAccountInfo"
        >
          Сохранить
        </vs-button>

      </vs-card-body>
    </vs-card>

  </div>
</template>

<script>
import db from '../plugins/firebaseInit.js'
// Категории работ
import category from '../plugins/category.js'

export default {
  name: 'AccountSetings',
  data: () => ({
    // Имя
    name: '',

    // Возраст
    age: 20,

    // Город
    city: '',

    // Информация о себе (для мастеров)
    description: '',

    // Опыт (для мастеров)
    experience: '',

    // Выды выполняемых работ (для мастеров)
    category: [],

    // Типы работ
    types: category
  }),
  computed: {
    // Флаг является ли пользователь мастером
    isMaster() {
      return this.$store.getters.isMaster
    },

    // Id пользователя
    authorId() {
      return this.$store.getters.userId
    },

    // Выды выполняемых работ в виде объекта для fierbase
    // (firebase плохо поддерживает работу с масивами поэтому рекомендуют конвертировать их в объекты)
    //  https://firebase.google.com/docs/firestore/solutions/arrays?authuser=2
    // categoryObj() {
    //   return this.category.reduce((acc, item) => {
    //     acc[item] = true
    //     return acc
    //   }, {})
    // }
  },
  mounted() {
    this.initAccountInfoData()
  },
  methods: {
    //
    convertObjectToArray(obj) {
      const arr = []

      for (let propName in obj) {
        arr.push(propName)
      }

      return arr
    },

    //
    convertArrayToObject(arr) {
      return arr.reduce((acc, item) => {
        acc[item] = true
        return acc
      }, {})
    },

    // Инициализация информации о аккаунте которая хранится в veux
    initAccountInfoData() {
      const user = this.$store.state.user

      if (!user) {
        return
      }

      this.name = user.name || ''
      this.age = user.age || ''
      this.city = user.city || ''
      this.description = user.description || ''

      if (!this.isMaster) {
        return
      }

      this.experience = user.experience || ''
      this.category = user.category ? this.convertObjectToArray(user.category) : []
    },

    // Обновление инофрмации о аккаунте
    updateAccountInfo() {
      const data = {
        name: this.name,
        age: this.age,
        city: this.city,
        description: this.description,
        experience: this.experience,
        category: this.category
      }

      if (this.isMaster) {
        data.experience = this.experience
        data.category = this.category.length ? this.convertArrayToObject(this.category) : null 
      }

      db.collection('users')
        .doc(this.authorId)
        .update(data)
        .then(() => this.$store.commit('setUser', Object.assign({}, this.$store.state.user, data)))
        .catch(error => console.log(error))
    }
  }
}
</script>

<style scoped>
.vs-col {
  display: flex;
  margin-bottom: 5px;
}
</style>
