<template>
  <div class="home-helper__wrapper">
    <h1>Заявки</h1>

    <div class="issues__container">
      <div class="issues-items">
        <preloader v-if="loading"/>

        <template v-else>
          <vs-alert v-if="!haveIssues" vs-color="primary" vs-active="true">
            Заявки отсутствуют
          </vs-alert>

          <vs-card v-else v-for="issue in issues" :key="issue.id" actionable>
            <vs-card-header :vs-title="issue.name" :vs-fill="true">
              <vs-avatar vs-size="large" :vs-text="issue.author"/>
            </vs-card-header>

            <vs-card-body>
              <div>
                <vs-chip vs-color="primary">
                  Открыта
                </vs-chip>
                <vs-chip v-if="issue.date && issue.date.seconds" vs-color="primary">
                  Дата окончания
                  {{ formatDate(issue.date)  }}
                </vs-chip>
                <vs-chip vs-color="primary">
                  {{ 0 }} откликов
                </vs-chip>

                <h4>Автор:</h4>
                <p>{{ issue.author }}</p>

                <h4 class="mt-15">Описание:</h4>
                <p>{{ issue.description }}</p>
              </div>

              <vs-button
                vs-color="primary"
                vs-type="filled"
                @click="goToIssue(issue.id)"
                class="mt-15"
              >
                Подробнее
              </vs-button>

            </vs-card-body>
          </vs-card>
        </template>
      </div>

      <div class="category-filter-wrapper">
        <category-filter @changeCurentFilter="changeCurentFilter" />
      </div>

    </div>
  </div>
</template>

<script>
import db from '../plugins/firebaseInit.js'
import dayjs from 'dayjs'

export default {
  name: 'Issues',
  components: {
    CategoryFilter: () => import('../components/CategoryFilter.vue')
  },
  data: () => ({
    loading: true,

    issues: [],

    curentFilter: ''
  }),
  computed: {
    haveIssues() {
      return this.issues.length > 0
    }
  },
  watch: {
    curentFilter(filter) {
      this.issues = []

      if (filter === 'all') {
        this.loadIssues()
      } else {
        this.loadfilteredIssues()
      }
    }
  },
  mounted() {
    // this.loadIssues()
  },
  methods: {
    showNotificacion({ title, text, color = 'primary' }) {
      this.$vs.notify({ title, text, color })
    },

    formatDate(date) {
      return dayjs(date.seconds * 1000).format('DD.MM.YYYY')
    },

    changeCurentFilter(id) {
      this.curentFilter = id
    },

    goToIssue(id) {
      this.$router.push({ name: 'issue', params: { id } })
    },

    loadIssues() {
      this.loading = true

      db.collection('issues')
        .get()
        .then(querySnaphot => {
          querySnaphot.forEach(doc => {
            let issue = {
              id: doc.id,
              name: doc.data().name,
              description: doc.data().description,
              author: doc.data().author,
              date: doc.data().date
            }

            this.issues.push(issue)
          })

          this.loading = false
        })
        .catch(error => this.showNotificacion({
          title: 'Ошибка при загрузке заявок!',
          text: error,
          color: 'danger'
        }))
    },

    loadfilteredIssues() {
      this.loading = true

      db.collection('issues')
        .where('type', '==', this.curentFilter)
        .get()
        .then(querySnaphot => {
          querySnaphot.forEach(doc => {
            let issue = {
              id: doc.id,
              name: doc.data().name,
              description: doc.data().description,
              author: doc.data().author,
            }

            this.issues.push(issue)
          })

          this.loading = false
        })
        .catch(error => this.showNotificacion({
          title: 'Ошибка при загрузке заявок!',
          text: error,
          color: 'danger'
        }))
    }
  }
}
</script>

<style scoped>
.issues__container {
  display: flex;
}

.issues-items {
  width: 75%;
}

.category-filter-wrapper {
  width: 25%;
  position: fixed;
  right: 15px;
  top: 90px;
}
</style>
