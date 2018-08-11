<template>
  <div class="home-helper__wrapper">
    <h1>Заявка {{ closedIssue ? 'закрыта' : '' }}</h1>

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

        <vs-card v-for="offer in offers" :key="offer.masterId" class="offer">
          <vs-card-body>
            <div>
              <vs-chip vs-color="primary" v-if="closedIssue && offer.masterId === masterId">
                Выбран как исполнитель
              </vs-chip>
              <p>Автор: {{ offer.author }}</p>
              <p>Описание: {{ offer.description }}</p>
              <p>Дата: {{ offer.date }}</p>
              <p>Цена: {{ offer.price }}</p>

              <h3 v-if="closedIssue && isOwnIssue && offer.masterId === masterId">
                Телефон: {{ offer.phone }}
              </h3>
            </div>
 
            <vs-button
              vs-color="primary"
              vs-type="filled"
              @click="goToMaster(offer.masterId)"
              class="mt-15"
            >
              Подробнее
            </vs-button>

            <vs-button
              v-if="isOwnIssue && !closedIssue"
              vs-color="success"
              vs-type="filled"
              @click="confirmCheckMaster(offer.masterId, offer.author)"
              class="mt-15 ml-15"
            >
              Выбрать мастера
            </vs-button>
          </vs-card-body>
        </vs-card>
      </div>

      <div v-if="!closedIssue && abilityToAddOffer && !creatingOffer && !isOwnIssue">
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

    <vs-prompt
      :vs-active.sync="activePromptCheckMaster"
      @vs-cancel="cancelCheckMaster"
      @vs-accept="saveMaster"
      vs-title="Выбрать мастера?"
      vs-accept-text="Выбрать"
      vs-cancel-text="Отменить"
    >
       <div>
          После выбора заявка перейдет в статус закрыта и вы увидите телефоный номер мастера
       </div>
     </vs-prompt>
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
    // Флаг загрузки
    loading: true,

    // Статус заявки
    status: '',

    // Флаг показа окна с подтверждением выбора мастера
    activePromptCheckMaster: false,

    // Id мастера выполняющего заявку
    masterId: '',

    // Id автора заявки
    authorId: '',
    
    // Название заявки
    name: '',

    // Описание заявки
    description: '',

    // Автор заявки
    author: '',

    // Дата окончания
    date: '',

    // Адрес
    address: '',

    // Отклики
    offers: null,

    // Флаг создания отклика
    creatingOffer: false,
  }),
  computed: {
    // Id заявки
    issueId() {
      return this.$route.params.id
    },

    // Id пользователя
    userId() {
      return this.$store.getters.userId
    },

    // Флаг является ли заявка закрытой
    closedIssue() {
      return this.status === 'close'
    },

    // Флаг оставлена ли заявка пользователем
    isOwnIssue() {  
      return this.authorId === this.userId
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

    // Перейти на страницу мастера
    goToMaster(id) {
      this.$router.push({ name: 'master', params: { id } })
    },

    // Форматирвание даты
    formatDate(date) {
      if (!date || !date.seconds) {
        return 'Дата окончания не указана'
      }

      return dayjs(date.seconds * 1000).format('DD.MM.YYYY')
    },

    // Отобразить компонент создания отклика
    createOffer() {
      this.creatingOffer = true
    },

    // Добавить отклик
    addOffer(offer) {
      if (!this.offers) {
        this.offers = {}
      }

      this.$set(this.offers, this.userId, offer)
      this.creatingOffer = false
    },

    // Загрузить заявку
    loadIssue() {
      this.loading = true

      db.collection('issues')
        .doc(this.issueId)
        .get()
        .then(doc => {
          this.authorId = doc.data().authorId,
          this.masterId = doc.data().masterId,
          this.status =  doc.data().status,
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
    },

    // Подтверждение выбора мастера
    confirmCheckMaster(masterId, masterName) {
      this.activePromptCheckMaster = true
      this.masterId = masterId
    },

    // Отменить выбор мастера
    cancelCheckMaster() {
      this.masterId = ''
    },

    // Выбрать мастера
    saveMaster() {
      db.collection('issues').doc(this.issueId).update({
        status: 'close',
        masterId: this.masterId
      })
      .then(() => this.status = 'close')
      .catch(error => this.showNotificacion({
        title: 'Ошибка при выборе мастера!',
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
