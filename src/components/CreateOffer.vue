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
import dayjs from 'dayjs'

export default {
  name: 'CreateOffer',
  props: {
    issueId: {
      type: String,
      required: true
    }
  },
  data: () => ({
    title: '',
    description: '',
    price: ''
  }),
  computed: {
    author() {
      return this.$store.state.user.name || this.$store.state.user.author
    },

    authorId() {
      return this.$store.getters.userId
    }
  },
  methods: {
    addOffer() {
      const data = {
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
