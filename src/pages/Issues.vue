<template>
  <div class="home-helper__wrapper">
    <h1>Заявки</h1>

    <div class="filter-btn primary" @click="showModalFiler">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
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

        <template>
          <vs-alert v-if="!haveIssues && !loading" vs-color="primary" vs-active="true">
            Заявки отсутствуют
          </vs-alert>

          <vs-card
            v-if="haveIssues"
            v-for="issue in issues"
            :key="issue.id"
          >
            <vs-card-header
              :vs-title="issue.name"
              :vs-fill="true"
              vs-background-color="white"
              class="card-header-fix"
            >
              <vs-avatar vs-size="large" :vs-text="issue.author"/>
            </vs-card-header>

            <vs-card-body>
              <div>
                <vs-chip vs-color="success">
                  {{ issue.status === 'open' ? 'Открыта' : 'Закрыта' }}
                </vs-chip>
                <vs-chip vs-color="success">
                  Отклики: {{ issue.offersCount || 0 }}
                </vs-chip>
                <vs-chip v-if="checkIssueRelevance(issue.date)" vs-color="warning">
                  Просрочена
                </vs-chip>

                <h4 class="mt-15">Автор:</h4>
                <p>{{ issue.author }}</p>

                <h4 class="mt-15">Дата окончания:</h4>
                <p>{{ issue.date && issue.date.seconds ? formatDate(issue.date) : '-' }}</p>

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

        <preloader v-if="loading" preloader-type="block"/>
      </div>

      <div class="sidebar-wrapper">
        <category-filter
          v-model="curentFilter"
          :custom-filters="customFilters"
          @changeCurentFilter="changeCurentFilter"
        />

        <faq-links />
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
    CategoryFilter: () => import('../components/CategoryFilter.vue'),
    FaqLinks: () => import('../components/FaqLinks.vue')
  },
  data: () => ({
    // Флаг загрузки
    loading: true,

    // Процесс загрузки заявок
    issuesAppending: true,

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
    curentFilter: 'all',

    // Количество загружаемых заявок за раз
    limit: 5,

    // Последний загруженный документ (заявка) из firebase (необходимо для пагинации)
    lastFirebaseDoc: null
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
      this.lastFirebaseDoc = null

      this.loadIssues(filter)
    }
  },
  mounted() {
    document.addEventListener('scroll', this.checkScroll)

    this.loadIssues(this.curentFilter)
  },
  destroyed() {
    document.removeEventListener('scroll', this.checkScroll)
  },
  methods: {
    // Форматирование даты
    formatDate(date) {
      return dayjs(date.seconds * 1000).format('DD.MM.YYYY')
    },

    // Подгрузка заявок при скроле
    checkScroll() {
      if (!this.loading || this.issuesAppending) {
        return
      }
      
      // 250px - высота прлоудера
      if (
          document.documentElement.scrollTop +
          document.documentElement.clientHeight > 
          document.documentElement.scrollHeight - 250
        ) {
          this.loadIssues(this.curentFilter)
      }
    },

    // Проверить актуальность заявки
    checkIssueRelevance(date) {
      return dayjs(date.seconds * 1000).isBefore(dayjs())
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
      this.issuesAppending = true

      let issuesFromDB = db.collection('issues')

      if (filter === 'all') {
        // для показа всех заявк не используем where
      } else if (filter === 'ownIssues') {
        issuesFromDB = issuesFromDB.where('authorId', '==', this.authorId)
      } else {
        issuesFromDB = issuesFromDB.where('type', '==', filter)
      }

      // Если уже были загружены заявки начинаем поиск с последнего документа
      if (this.lastFirebaseDoc) {
        issuesFromDB = issuesFromDB.startAfter(this.lastFirebaseDoc)
      }

      // Ограничение по количеству
      issuesFromDB = issuesFromDB.limit(this.limit)

      // Загружаем с учетом всех фильтров
      issuesFromDB
        .get()
        .then(querySnaphot => {
          this.lastFirebaseDoc = querySnaphot.docs[querySnaphot.docs.length - 1]

          // Если заявок меньше чем значение limit значит это последняя страница
          if (querySnaphot.docs.length < this.limit) {
            this.lastFirebaseDoc = null
          }

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

          // Если lastFirebaseDoc ложно - загружены все данные
          if (!this.lastFirebaseDoc) {
            this.loading = false
          }

          this.issuesAppending = false
        })
        .catch(error => this.$vs.notify({
          title: 'Ошибка при загрузке заявок!',
          text: error.message || error,
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
  background: white;
  position: fixed;
  bottom: 25px;
  right: 25px;
  padding: 10px;
  border-radius: 50%;
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

.sidebar-wrapper {
  width: 25%;
  margin-left: 25px;
}

.card-header-fix {
  color: rgba(var(--primary),1)!important
}

@media only screen and (max-width: 768px){ 
  .modal-filter {
    width: 90%;
  }

  .issues-items {
    width: 100%;
  }
  .sidebar-wrapper {
    display: none;
  }
}
</style>
