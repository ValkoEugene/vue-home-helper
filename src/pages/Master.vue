<template>
  <div class="home-helper__wrapper">
    <h1>Мастер</h1>

    <preloader v-if="loading"/>

    <div v-else>
      <vs-card>
        <vs-card-header :vs-title="name" />
        <vs-card-body>
          <div>
            <p>Возраст: {{ age }}</p>
            <p>Описание: {{ description }}</p>
            <p>Город: {{ city }}</p>
            <p>Опыт: {{ experience }}</p>
            <p>
              Категории: {{ categoriesValue }}
            </p>
          </div>
        </vs-card-body>
      </vs-card>

      <vs-alert vs-color="primary" vs-active="true">
        Отзывы отсутствуют
      </vs-alert>

    </div>
  </div>
</template>

<script>
import db from '../plugins/firebaseInit.js'
// Категории работ
import category from '../plugins/category.js'

export default {
  name: 'Master',
  data: () => ({
    // Флаг загрузки
    loading: true,

    // Типы работ
    types: category,

    // Имя мастера
    name: '',

    // Возраст
    age: '',

    // Город
    city: '',

    // Описание
    description: '',

    // Опыт
    experience: '',

    // Категории мастера
    categories: null
  }),
  computed: {
    // Id мастера
    masterId() {
      return this.$route.params.id
    },

    // Категории в виде массива
    categoriesArr() {
      if (!this.categories) {
        return []
      }

      const arr = []

      for (let propName in this.categories) {
        arr.push(propName)
      }

      return arr
    },

    // Значения категорий
    categoriesValue() {
      if (!this.categoriesArr.length) {
        return []
      }

      return this.categoriesArr.map(item => {
        return this.types.find(type => type.id === item).name
      }).join(', ')
    }
  },
  mounted() {
    this.loadMaster()
  },
  methods: {
    // Показать уведомление
    showNotificacion({ title, text, color = 'primary' }) {
      this.$vs.notify({ title, text, color })
    },

    loadMaster() {
      this.loading = true

      db.collection('users')
        .doc(this.masterId)
        .get()
        .then(doc => {
          this.name = doc.data().name,
          this.age = doc.data().age,
          this.city = doc.data().city,
          this.description = doc.data().description,
          this.experience = doc.data().experience,
          this.categories = doc.data().category

          this.loading = false
        })
        .catch(error => this.showNotificacion({
          title: 'Ошибка при загрузке информации о мастере!',
          text: error,
          color: 'danger'
        }))
    }
  }
}
</script>
