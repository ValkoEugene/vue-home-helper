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

        <vs-input
          vs-label="Описание"
          vs-type="text"
          v-model.trim="description"
        />

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
    // Показать уведомление
    showNotificacion({ title, text, color = 'primary' }) {
      this.$vs.notify({ title, text, color })
    },

    // Создаем отзыв
    addReview() {
      const data = {
        clientId: this.authorId,
        title: this.title,
        description: this.description,
        rating: this.rating,
        date: dayjs().format('DD.MM.YYYY'),
        author: this.author
      }

      db.collection('users').doc(this.masterId).update({
        [`reviews.${this.authorId}`] : data
      })
      .then(() => this.$emit('addReview', data))
      .catch(error => this.showNotificacion({
        title: 'Ошибка при добавлении отзыва!',
        text: error,
        color: 'danger'
      }))
    }
  }
}
</script>
