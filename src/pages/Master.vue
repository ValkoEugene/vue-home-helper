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

      <vs-alert v-if="!reviewsCount" vs-color="primary" vs-active="true">
        Отзывы отсутствуют
      </vs-alert>

      <div v-else class="reviews-wrapper">
        <h2>Отзывы клиентов</h2>

        <vs-card v-for="review in reviews" :key="review.clientId">
          <vs-card-body>
            <div>
              <p>Автор: {{ review.author }}</p>
              <p>Описание: {{ review.description }}</p>
              <p>Дата: {{ review.date }}</p>
              <p>Оценка мастера: {{ review.rating }}%</p>
            </div>
          </vs-card-body>
        </vs-card>
      </div>

      <div v-if="abilityToAddReview && !creatingReview">
        <vs-button
          vs-color="primary"
          vs-type="filled"
          @click="createReview"
        >
          Оставить отзыв
        </vs-button>
      </div>

      <div v-if="creatingReview">
        <create-review :master-id="masterId" @addReview="addReview"/>
      </div>

    </div>
  </div>
</template>

<script>
import db from '../plugins/firebaseInit.js'
// Категории работ
import category from '../plugins/category.js'

export default {
  name: 'Master',
  components: {
    CreateReview: () => import('../components/CreateReview.vue')
  },
  data: () => ({
    // Флаг загрузки
    loading: true,

    // Флаг создания отзыва
    creatingReview: false,

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
    categories: null,

    // Клиенты мастера
    clients: null,

    // Отзывы
    reviews: {}
  }),
  computed: {
    // Id пользователя
    userId() {
      return this.$store.getters.userId
    },

    // Id мастера
    masterId() {
      return this.$route.params.id
    },

    // Количество оставленных отзывов
    reviewsCount() {
      return Object.keys(this.reviews).length
    },

    // Проверка на возможность оставить отзыв
    abilityToAddReview() {
      return this.clients && this.userId !== this.masterId 
      && this.clients[this.userId] && !this.reviews[this.userId]
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
    // Отобразить компонент создания отзыва
    createReview() {
      this.creatingReview = true
    },

    // Добавить отзыв
    addReview(review) {
      if (!this.reviews) {
        this.reviews = {}
      }

      this.$set(this.reviews, this.userId, review)
      this.creatingReview = false
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
          this.clients = doc.data().clients
          this.reviews = doc.data().reviews || {}

          this.loading = false
        })
        .catch(error => this.$vs.notify({
          title: 'Ошибка при загрузке информации о мастере!',
          text: error.message || error,
          color: 'danger'
        }))
    }
  }
}
</script>

<style scoped>
.reviews-wrapper {
  width: 90%;
  margin: auto;
}
</style>