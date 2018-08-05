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
            <vs-card-header :vs-title="master.name" />
            <vs-card-body>
              <div>
                <p>Информация: {{ master.description || '-' }}</p>
                <p>Возраст: {{ master.age || '-' }}</p>
                <p>Город: {{ master.city || '-' }}</p>
                <p>Опыт: {{ master.experience || '-' }}</p>
              </div>
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
    loading: true,

    masters: [],

    curentFilter: ''
  }),
  computed: {
    haveMasters() {
      return this.masters.length > 0
    }
  },
  watch: {
    curentFilter(filter) {
      this.masters = []

      if (filter === 'all') {
        this.loadMasters()
      } else {
        this.loadfilteredMasters()
      }
    }
  },
  mounted() {
    // this.loadMasters()
  },
  methods: {
    showNotificacion({ title, text, color = 'primary' }) {
      this.$vs.notify({ title, text, color })
    },

    changeCurentFilter(id) {
      this.curentFilter = id
    },
    
    // 
    getMatersFromQuerySnaphot(querySnaphot) {
      const masters = []
      console.log(querySnaphot)

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

        console.log(master)

        masters.push(master)
      })

      return masters
    },

    loadMasters() {
      this.loading = true

      db.collection('users')
        .where('accountType', '==', 'master')
        .get()
        .then(querySnaphot => this.getMatersFromQuerySnaphot(querySnaphot))
        .then(mastres => {
          this.masters = mastres
          this.loading = false
        })
        .catch(error => this.showNotificacion({
          title: 'Ошибка при загрузке заявок!',
          text: error,
          color: 'danger'
        }))
    },

    loadfilteredMasters() {
      this.loading = true

      db.collection('users')
        .where('accountType', '==', 'master')
        .where(`category.${this.curentFilter}`, '==', true)
        .get()
        .then(querySnaphot => this.getMatersFromQuerySnaphot(querySnaphot))
        .then(mastres => {
          this.masters = mastres
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
.masters__container {
  display: flex;
}

.masters-items {
  width: 75%;
}

.category-filter-wrapper {
  width: 25%;
}
</style>