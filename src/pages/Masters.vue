<template>
   <div class="home-helper__wrapper">
    <h1>Мастера</h1>

    <div class="filter-btn primary">
      <i class="material-icons" @click="showModalFiler">
        filter_list
      </i>
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
        <category-filter
          v-model="curentFilter"
          @changeCurentFilter="changeCurentFilter"
        />
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

    // Флаг показа фильтра в модальном окне
    showingModalFiler: false,

    // Список мастеров
    masters: [],

    // Текущий фильтр
    curentFilter: 'all'
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
  mounted() {
    this.loadMasters('all')
  },
  methods: {
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

@media only screen and (max-width: 768px){ 
  .modal-filter {
    width: 90%;
  }

  .masters-items {
    width: 100%;
  }
  .category-filter-wrapper {
    display: none;
  }
}
</style>