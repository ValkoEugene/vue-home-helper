<!-- Компонент создания отклика к заявке -->

<template>
  <vs-card>
    <vs-card-header vs-title="Ваше предложение" />
    <vs-card-body>
      <div>
        <vs-input
          vs-label="Тема"
          vs-type="text"
          v-model.trim="title"
        />

        <label>Описание</label>
        <textarea v-model.trim="description" rows="4" placeholder="..."/>


        <label>Цена</label>
        <input type="number" class="mb-15" v-model="price">

        <vs-button
          vs-color="primary"
          vs-type="filled"
          @click="addOffer"
        >
          Предложить услуги
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
  name: 'CreateOffer',
  props: {
    // Id заявки
    issueId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    // Заголовок отклика
    title: '',
    
    // Описание отклика
    description: '',

    // Предлагаемая цена за услугу
    price: ''
  }),
  computed: {
    // Имя автора отклика
    author() {
      return this.$store.getters.userName
    },

    // Телефон атора отклика
    authorPhone() {
      return this.$store.getters.userPhone
    },

    // Id автора отклика
    authorId() {
      return this.$store.getters.userId
    }
  },
  methods: {
    // Проверить заполненность формы
    validateForm() {
      if (!this.title) {
        this.showHint('Заполните поле - Тема')
        return false
      }

      if (!this.description) {
        this.showHint('Заполните поле - Описание')
        return false
      }

      if (!this.price) {
        this.showHint('Заполните поле - Цена')
        return false
      }

      return true
    },

    // Показать подсказку
    showHint(text) {
      this.$vs.notify({
        title: 'Корректно заполните форму!',
        color: 'danger',
        text
      })
    },

    // Создаем отклик
    addOffer() {
      if (!this.author) {
        this.$vs.notify({
          title: 'Ошибка при добавлении отклика!',
          text: 'Укажите имя в настройках аккаунта',
          color: 'danger'
        })
        return
      }

      if (!this.authorPhone) {
        this.$vs.notify({
          title: 'Ошибка при добавлении отклика!',
          text: 'Укажите телефон в настройках аккаунта',
          color: 'danger'
        })
        return
      }

      if (!this.validateForm()) {
        return
      }

      const data = {
        masterId: this.authorId,
        phone: this.authorPhone,
        title: this.title,
        description: this.description,
        price: this.price,
        date: dayjs().format('DD.MM.YYYY'),
        author: this.author
      }

      db.collection('issues').doc(this.issueId).update({
        [`offers.${this.authorId}`] : data
      })
      .then(() => this.$emit('addOffer', data))
      .catch(error => this.$vs.notify({
        title: 'Ошибка при создании отклика',
        text: error.message || error,
        color: 'danger'
      }))
    }
  }
}
</script>
