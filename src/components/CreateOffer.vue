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

        <vs-input
          vs-label="Описание"
          vs-type="text"
          v-model.trim="description"
        />

        <vs-input
          vs-label="Цена"
          vs-type="text"
          v-model.trim="price"
        />

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
    // Создаем отклик
    addOffer() {
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
      .catch(error => console.log(error))
    }
  }
}
</script>
