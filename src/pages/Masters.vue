<template>
   <div class="home-helper__wrapper">
    <h1>Мастера</h1>

    <div class="filter-btn" @click="showModalFiler">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    </div>

    <div class="modal-filter-wrapper" v-show="showingModalFiler" @click="closeModalFilter">
      <category-filter
        class="modal-filter"
        v-model="curentFilter"
        @changeCurentFilter="changeCurentFilter"
      />
    </div>

    <div class="masters__container">
      <div class="masters-items">

        <template>
          <vs-alert v-if="!haveMasters && !loading" vs-color="primary" vs-active="true">
            Мастера отсутствуют
          </vs-alert>

          <vs-card
            v-if="haveMasters"
            v-for="master in masters"
            :key="master.id"
          >
            <vs-card-header :vs-title="master.name" :vs-fill="true">
              <vs-avatar vs-size="large" :vs-text="master.name"/>
            </vs-card-header>
            
            <vs-card-body>
              <div class="master-body-wrapper">
                <div class="master-body-content">
                  <h4>Информация:</h4>
                  <p>{{ master.description || '-' }}</p>

                  <h4 class="mt-15">Возраст:</h4>
                  <p>{{ master.age || '-' }}</p>

                  <h4 class="mt-15">Город:</h4>
                  <p>{{ master.city || '-' }}</p>

                  <h4 class="mt-15">Опыт:</h4>
                  <p>{{ master.experience || '-' }}</p>
                </div>

                <div class="master-body-rating">
                  <h4>Общий рейтинг</h4>
                  <p>{{ `${!master.reviewsCount ? 0 : Math.round(master.totalRatingSum / master.reviewsCount) }/100` }}</p>
                  <h4>Количство отзывов: {{ master.reviewsCount }}</h4>
                </div>
              </div>

              <vs-button
                vs-color="primary"
                vs-type="filled"
                @click="goToMaster(master.id)"
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
          @changeCurentFilter="changeCurentFilter"
        />

        <faq-links />
      </div>
    </div>

  </div>
</template>

<script>
import db from '../plugins/firebaseInit.js'

export default {
  name: 'Masters',
  components: {
    CategoryFilter: () => import('../components/CategoryFilter.vue'),
    FaqLinks: () => import('../components/FaqLinks.vue')
  },
  data: () => ({
    // Флаг загрузки
    loading: true,

    // Процесс загрузки мастеров
    mastersAppending: true,

    // Флаг показа фильтра в модальном окне
    showingModalFiler: false,

    // Список мастеров
    masters: [],

    // Текущий фильтр
    curentFilter: 'all',

    // Количество загружаемых мастеров за раз
    limit: 5,

    // Последний загруженный документ (мастер) из firebase (необходимо для пагинации)
    lastFirebaseDoc: null
  }),
  computed: {
    // Флаг наличия мастеров
    haveMasters() {
      return this.masters.length > 0
    }
  },
  watch: {
    curentFilter(filter) {
      this.masters = []
      this.lastFirebaseDoc = null

      this.loadMasters(filter)
    }
  },
  mounted() {
    document.addEventListener('scroll', this.checkScroll)

    this.loadMasters('all')
  },
  destroyed() {
    document.removeEventListener('scroll', this.checkScroll)
  },
  methods: {
    // Подгрузка заявок при скроле
    checkScroll() {
      if (!this.loading || this.mastersAppending) {
        return
      }
      
      // 250px - высота прлоудера
      if (
          document.documentElement.scrollTop +
          document.documentElement.clientHeight > 
          document.documentElement.scrollHeight - 250
        ) {
          this.loadMasters(this.curentFilter)
      }
    },

    // Перейти на сраницу мастера
    goToMaster(id) {
      this.$router.push({ name: 'master', params: { id } })
    },

    // Поменять текущий фильтр
    changeCurentFilter(id) {
      this.curentFilter = id
    },

    // Показать фильтр в модальном окне
    showModalFiler() {
      this.showingModalFiler = true
    },

    // Скрыть фильтр в модальном окне
    closeModalFilter() {
      this.showingModalFiler = false
    },
    
    // Загрузить список мастеров
    loadMasters(filter) {
      this.loading = true
      this.mastersAppending = true

      // Фильтр по типу пользователя - только мастера
      let mastersFromDB = db.collection('users')
        .where('accountType', '==', 'master')
      
      // Если выбрана категория фильтруем по ней
      if (filter !== 'all') {
        mastersFromDB = mastersFromDB.where(`category.${filter}`, '==', true)
      }

      // Если уже были загружены мастера начинаем поиск с последнего документа
      if (this.lastFirebaseDoc) {
        mastersFromDB = mastersFromDB.startAfter(this.lastFirebaseDoc)
      }

      // Ограничение по количеству
      mastersFromDB = mastersFromDB.limit(this.limit)

      mastersFromDB
        .get()
        .then(querySnaphot => {
          this.lastFirebaseDoc = querySnaphot.docs[querySnaphot.docs.length - 1]

          // Если заявок меньше чем значение limit значит это последняя страница
          if (querySnaphot.docs.length < this.limit) {
            this.lastFirebaseDoc = null
          }

          querySnaphot.forEach(doc => {
            let master = {
              id: doc.id,
              name: doc.data().name,
              accountType: doc.data().accountType,
              age: doc.data().age,
              city: doc.data().city,
              description: doc.data().description,
              experience: doc.data().experience,
              category: doc.data().category,
              reviewsCount: doc.data().reviewsCount || 0,
              totalRatingSum: doc.data().totalRatingSum || 0
            }

            this.masters.push(master)
          })

          // Если lastFirebaseDoc ложно - загружены все данные
          if (!this.lastFirebaseDoc) {
            this.loading = false
          }

          this.mastersAppending = false
        })
        .catch(error => this.$vs.notify({
          title: 'Ошибка при загрузке мастеров!',
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

.masters__container {
  display: flex;
}

.masters-items {
  width: 75%;
}

.master-body-wrapper {
  display: flex;
}

.master-body-content {
  width: 75%;
}

.master-body-rating {
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.master-body-rating p {
  color: #1f74ff;
  font-size: 28px;
  font-weight: bold;
}

.sidebar-wrapper {
  width: 25%;
  margin-left: 25px;
}

@media only screen and (max-width: 768px){ 
  .modal-filter {
    width: 90%;
  }

  .masters-items {
    width: 100%;
  }
  .sidebar-wrapper {
    display: none;
  }
}
</style>