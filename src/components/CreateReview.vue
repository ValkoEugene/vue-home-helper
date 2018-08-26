<!-- Компонент создания отзывы мастеру -->

<template>
  <vs-card>
    <vs-card-header vs-title="Ваш отзыв" />
    <vs-card-body>
      <div>
        <vs-input
          vs-label="Тема"
          vs-type="text"
          v-model.trim="title"
        />

        <label>Описание</label>
        <textarea v-model.trim="description" rows="5" />

        <label>Оценка мастеру</label>
        <vs-slider color="success" text-fixed="%" v-model="rating"/>

        <vs-button
          vs-color="primary"
          vs-type="filled"
          @click="addReview"
        >
          Добавить отзыв
        </vs-button>
      </div>
    </vs-card-body>
    </vs-card>
</template>

<script>
import db from '../plugins/firebaseInit.js'
// Плагин по работе с датами
import dayjs from 'dayjs'

export default {
  name: 'CreateReview',
  props: {
    // Id мастера
    masterId: {
      type: String,
      required: true
    },

    // Количество оставленных отзывов
    reviewsCount: {
      type: Number,
      required: true
    },

    // Общая сумма баллов рейтинга
    totalRatingSum: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    // Заголовок отзывы
    title: '',
    
    // Описание отзывы
    description: '',

    // Оценка
    rating: 0
  }),
  computed: {
    // Имя автора отзывы
    author() {
      return this.$store.getters.userName
    },

    // Id автора отклика
    authorId() {
      return this.$store.getters.userId
    }
  },
  methods: {
    // Создаем отзыв
    addReview() {
      if (!this.author) {
        this.$vs.notify({
          title: 'Ошибка при добавлении отзыва!',
          text: 'Укажите имя в настройках аккаунта',
          color: 'danger'
        })
        return
      }

      const data = {
        clientId: this.authorId,
        title: this.title,
        description: this.description,
        rating: this.rating,
        date: dayjs().format('DD.MM.YYYY'),
        author: this.author
      }

      const newRating = {
        reviewsCount: this.reviewsCount + 1,
        totalRatingSum: this.totalRatingSum + this.rating
      }

      db.collection('users').doc(this.masterId).update({
        [`reviews.${this.authorId}`] : data,
        reviewsCount: newRating.reviewsCount,
        totalRatingSum: newRating.totalRatingSum
      })
      .then(() => {
        this.$emit('addReview', data)
        this.$emit('updateRating', newRating)
      })
      .catch(error => this.$vs.notify({
        title: 'Ошибка при добавлении отзыва!',
        text: error.message || error,
        color: 'danger'
      }))
    }
  }
}
</script>
