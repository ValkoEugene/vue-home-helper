<template>
  <div class="home-helper__wrapper">
    <h1>Заявки</h1>

    <div class="filter-btn primary">
      <i class="material-icons" @click="showModalFiler">
        filter_list
      </i>
    </div>

    <div class="modal-filter-wrapper" v-show="showingModalFiler" @click="closeModalFilter">
      <category-filter
        class="modal-filter"
        v-model="curentFilter"
        :custom-filters="customFilters"
        @changeCurentFilter="changeCurentFilter"
      />
    </div>

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
                  {{ issue.status === 'open' ? 'Открыта' : 'Закрыта' }}
                </vs-chip>
                <vs-chip v-if="issue.date && issue.date.seconds" vs-color="primary">
                  Дата окончания
                  {{ formatDate(issue.date)  }}
                </vs-chip>
                <vs-chip vs-color="primary">
                  Отклики: {{ issue.offersCount || 0 }}
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
        <category-filter
          v-model="curentFilter"
          :custom-filters="customFilters"
          @changeCurentFilter="changeCurentFilter"
        />
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
    // Флаг загрузки
    loading: true,

    // Флаг показа фильтра в модальном окне
    showingModalFiler: false,

    // Список заявок
    issues: [],

    // Фильтр для показа собственных заявок
    customFilters: [
      {
        id: 'ownIssues',
        name: 'Ваши заявки'
      }
    ],

    // Текущий фильтр
    curentFilter: 'all'
  }),
  computed: {
    // Флаг наличия заявок
    haveIssues() {
      return this.issues.length > 0
    },

    // Id пользователя
    authorId() {
      return this.$store.getters.userId
    },
  },
  watch: {
    curentFilter(filter) {
      this.issues = []

      this.loadIssues(filter)
    }
  },
  mounted() {
    this.loadIssues(this.curentFilter)
  },
  methods: {
    showNotificacion({ title, text, color = 'primary' }) {
      this.$vs.notify({ title, text, color })
    },

    // Форматирование даты
    formatDate(date) {
      return dayjs(date.seconds * 1000).format('DD.MM.YYYY')
    },

    // Показать фильтр в модальном окне
    showModalFiler() {
      this.showingModalFiler = true
    },

    // Скрыть фильтр в модальном окне
    closeModalFilter() {
      this.showingModalFiler = false
    },

    // Поменять текущий фильтр
    changeCurentFilter(id) {
      this.curentFilter = id
    },

    // Перейти к странице заявки
    goToIssue(id) {
      this.$router.push({ name: 'issue', params: { id } })
    },

    // Загрузить заявки
    loadIssues(filter) {
      this.loading = true

      let issuesFromDB = db.collection('issues')

      if (filter === 'all') {
        // для показа всех заявк не используем where
      } else if (filter === 'ownIssues') {
        issuesFromDB = issuesFromDB.where('authorId', '==', this.authorId)
      } else {
        issuesFromDB = issuesFromDB.where('type', '==', filter)
      }

      issuesFromDB.get()
        .then(querySnaphot => {
          querySnaphot.forEach(doc => {
            let issue = {
              id: doc.id,
              status: doc.data().status,
              name: doc.data().name,
              description: doc.data().description,
              author: doc.data().author,
              date: doc.data().date,
              offersCount: doc.data().offers ? Object.keys(doc.data().offers).length : 0
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
.modal-filter-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10000;
  background: #000000d9;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-filter {
  width: 50%;
}

.filter-btn {
  position: fixed;
  bottom: 25px;
  right: 25px;
  background: rgba(var(--primary),1);
  padding: 10px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  z-index: 100000;
  box-shadow: 0 20px 40px -8px rgba(0,0,0,.1);
}

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

@media only screen and (max-width: 768px){ 
  .modal-filter {
    width: 90%;
  }

  .issues-items {
    width: 100%;
  }
  .category-filter-wrapper {
    display: none;
  }
}
</style>
