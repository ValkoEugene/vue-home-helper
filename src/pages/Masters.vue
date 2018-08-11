<template>
   <div class="home-helper__wrapper">
    <h1>Мастера</h1>

    <div class="masters__container">
      <div class="masters-items">
        <preloader v-if="loading"/>

        <template v-else>
          <vs-alert v-if="!haveMasters" vs-color="primary" vs-active="true">
            Мастера отсутствуют
          </vs-alert>

          <vs-card v-else v-for="master in masters" :key="master.id">
            <vs-card-header :vs-title="master.name" :vs-fill="true">
              <vs-avatar vs-size="large" :vs-text="master.name"/>
            </vs-card-header>
            
            <vs-card-body>
              <div>
                <p>Информация: {{ master.description || '-' }}</p>
                <p>Возраст: {{ master.age || '-' }}</p>
                <p>Город: {{ master.city || '-' }}</p>
                <p>Опыт: {{ master.experience || '-' }}</p>
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
      </div>

      <div class="category-filter-wrapper">
        <category-filter @changeCurentFilter="changeCurentFilter" />
      </div>
    </div>

  </div>
</template>

<script>
import db from '../plugins/firebaseInit.js'

export default {
  name: 'Masters',
  components: {
    CategoryFilter: () => import('../components/CategoryFilter.vue')
  },
  data: () => ({
    // Флаг загрузки
    loading: true,

    // Список мастеров
    masters: [],

    // Текущий фильтр
    curentFilter: ''
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

      if (filter === 'all') {
        this.loadMasters('all')
      } else {
        this.loadMasters(filter)
      }
    }
  },
  methods: {
    showNotificacion({ title, text, color = 'primary' }) {
      this.$vs.notify({ title, text, color })
    },

    // Перейти на сраницу мастера
    goToMaster(id) {
      this.$router.push({ name: 'master', params: { id } })
    },

    // Поменять текущий фильтр
    changeCurentFilter(id) {
      this.curentFilter = id
    },
    
    // Загрузить список мастеров
    loadMasters(filter) {
      this.loading = true

      let mastersFromDB = db.collection('users')
        .where('accountType', '==', 'master')

      if (filter !== 'all') {
        mastersFromDB = mastersFromDB.where(`category.${filter}`, '==', true)
      }

      mastersFromDB.get()
        .then(querySnaphot => {
          querySnaphot.forEach(doc => {
            let master = {
              id: doc.id,
              name: doc.data().name,
              accountType: doc.data().accountType,
              age: doc.data().age,
              city: doc.data().city,
              description: doc.data().description,
              experience: doc.data().experience,
              category: doc.data().category
            }

            this.masters.push(master)
          })

          this.loading = false
        })
        .catch(error => this.showNotificacion({
          title: 'Ошибка при загрузке мастеров!',
          text: error,
          color: 'danger'
        }))
    }
  }
}
</script>

<style scoped>
.masters__container {
  display: flex;
}

.masters-items {
  width: 75%;
}

.category-filter-wrapper {
  width: 25%;
  position: fixed;
  right: 15px;
  top: 90px;
}
</style>