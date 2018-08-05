<template>
  <div class="home-helper__wrapper">
    <h1>Заявка</h1>

    <preloader v-if="loading"/>

    <div v-else>
      <vs-card>
        <vs-card-header :vs-title="name" />
        <vs-card-body>
          <div>
            <p>Автор: {{ author }}</p>
            <p>Описание: {{ description }}</p>
            <p>Дата окончания: {{ formatDate(date) }}</p>
            <p>Адрес: {{ address }}</p>
          </div>
        </vs-card-body>
      </vs-card>

      <vs-alert v-if="!offers" vs-color="primary" vs-active="true">
        Предложения отсутствуют
      </vs-alert>

      <div v-else class="offers-wrapper">
        <h2>Отклики мастеров</h2>

        <vs-card v-for="(offer, id) in offers" :key="id" class="offer">
          <vs-card-body>
            <div>
              <p>Автор: {{ offer.author }}</p>
              <p>Описание: {{ offer.description }}</p>
              <p>Дата: {{ offer.date }}</p>
              <p>Цена: {{ offer.price }}</p>
            </div>
          </vs-card-body>
        </vs-card>
      </div>

      <div v-if="abilityToAddOffer && !creatingOffer">
        <vs-button
          vs-color="primary"
          vs-type="filled"
          @click="createOffer"
        >
          Откликнуться
        </vs-button>
      </div>

      <div v-if="creatingOffer">
        <create-offer :issue-id="issueId" @addOffer="addOffer"/>
      </div>
    </div>
  </div>
</template>


<script>
import db from '../plugins/firebaseInit.js'
import dayjs from 'dayjs'

export default {
  name: 'Issue',
  components: {
    CreateOffer: () => import('../components/CreateOffer.vue')
  },
  data: () => ({
    loading: true,

    name: '',
    description: '',
    author: '',
    date: '',
    address: '',

    offers: null,

    creatingOffer: false,
  }),
  computed: {
    issueId() {
      return this.$route.params.id
    },

    userId() {
      return this.$store.getters.userId
    },

    abilityToAddOffer() {
      return this.$store.getters.isMaster &&
      (!this.offers || !this.offers[this.userId])
    }
  },
  mounted() {
    this.loadIssue()
  },
  methods: {
    showNotificacion({ title, text, color = 'primary' }) {
      this.$vs.notify({ title, text, color })
    },

    formatDate(date) {
      if (!date || !date.seconds) {
        return 'Дата окончания не указана'
      }

      return dayjs(date.seconds * 1000).format('DD.MM.YYYY')
    },

    createOffer() {
      this.creatingOffer = true
    },

    addOffer(offer) {
      if (!this.offers) {
        this.offers = {}
      }

      this.$set(this.offers, this.userId, offer)
      this.creatingOffer = false
    },

    loadIssue() {
      this.loading = true

      db.collection('issues')
        .doc(this.issueId)
        .get()
        .then(doc => {
          this.name = doc.data().name
          this.description = doc.data().description
          this.author = doc.data().author
          this.date = doc.data().date
          this.address = doc.data().address
          this.offers = doc.data().offers

          this.loading = false
        })
        .catch(error => this.showNotificacion({
          title: 'Ошибка при загрузке заявки!',
          text: error,
          color: 'danger'
        }))
    }
  }
}
</script>

<style scoped>
.offers-wrapper {
  width: 90%;
  margin: auto;
}
</style>
