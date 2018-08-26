<template>
  <div class="home-helper__wrapper">
    <h1>Мастер</h1>

    <preloader v-if="loading"/>

    <div v-else>
      <vs-card>
        <vs-card-header :vs-title="name" />
        <vs-card-body>
          <div class="master-body-wrapper">
            <div class="master-body-content">
              <h4>Информация:</h4>
              <p>{{ description || '-' }}</p>

              <h4 class="mt-15">Возраст:</h4>
              <p>{{ age || '-' }}</p>

              <h4 class="mt-15">Город:</h4>
              <p>{{ city || '-' }}</p>

              <h4 class="mt-15">Опыт:</h4>
              <p>{{ experience || '-' }}</p>

              <h4 class="mt-15">Категории:</h4>
              <p>{{ categoriesValue || '-' }}</p>
            </div>

            <div class="master-body-rating">
              <h4>Общий рейтинг</h4>
              <p>{{ `${rating}/100` }}</p>
              <h4>Количство отзывов: {{ reviewsCount }}</h4>
            </div>
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
            <div class="review-content">
              <p>
                <span>Автор:</span>
                {{ review.author }}
                </p>
              <p>
                <span>Описание:</span>
                {{ review.description }}
              </p>
              <p>
                <span>Дата:</span>
                {{ review.date }}
              </p>
              <p>
                <span>Оценка мастера:</span>
                {{ review.rating }}%
              </p>
            </div>
          </vs-card-body>
        </vs-card>
      </div>

      <div v-if="abilityToAddReview && !creatingReview" class="create-review">
        <vs-button
          vs-color="primary"
          vs-type="filled"
          @click="createReview"
        >
          Оставить отзыв
        </vs-button>
      </div>

      <div v-if="creatingReview">
        <create-review
          :master-id="masterId"
          :reviews-count="reviewsCount"
          :total-rating-sum="totalRatingSum"
          @addReview="addReview"
          @updateRating="updateRating"
        />
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
    reviews: {},

    // Количество оставленных отзывов
    reviewsCount: 0,

    // Общая сумма баллов рейтинга
    totalRatingSum: 0
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

    // Рейтинг мастера
    rating() {
      return !this.reviewsCount ? 0 : Math.round(this.totalRatingSum / this.reviewsCount)
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

    // Обновить рейтинг
    updateRating({ reviewsCount, totalRatingSum }) {
      this.reviewsCount = reviewsCount
      this.totalRatingSum = totalRatingSum
    },

    // Загрузить информацию о мастере
    loadMaster() {
      this.loading = true

      db.collection('users')
        .doc(this.masterId)
        .get()
        .then(doc => {
          this.name = doc.data().name
          this.age = doc.data().age
          this.city = doc.data().city
          this.description = doc.data().description
          this.experience = doc.data().experience
          this.categories = doc.data().category
          this.clients = doc.data().clients
          this.reviews = doc.data().reviews || {}
          this.reviewsCount = doc.data().reviewsCount || 0
          this.totalRatingSum = doc.data().totalRatingSum || 0

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
.review-content p span{
  color: rgba(var(--primary),1);
  font-weight: bold;
}

.create-review {
  position: fixed;
  bottom: 15px;
  right: 15px;
}

.master-body-wrapper {
  display: flex;
}

.master-body-content {
  width: 75%;
}

.master-body-rating {
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.master-body-rating p {
  color: rgba(var(--primary),1);
  font-size: 28px;
  font-weight: bold;
}

@media only screen and (max-width: 768px){
  .master-body-wrapper {
    flex-direction: column-reverse;
  }

  .master-body-content {
    width: 100%;
  }

  .master-body-rating {
    margin-bottom: 15px;
    width: 100%;
  }
}
</style>