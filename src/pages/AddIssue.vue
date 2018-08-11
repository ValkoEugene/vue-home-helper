<template>
  <div class="home-helper__wrapper">
    <h1>Создать заявку</h1>
    <vs-card>
      <vs-card-body>
        
        <vs-input
          vs-label="Название заявки"
          vs-type="text"
          v-model.trim="name"
        />

        <vs-select
          class="selectExample"
          vs-label="Тип заявки"
          v-model="type"
        >
          <vs-select-item
            v-for="type in types"
            :key="type.id"
            :vs-value="type.id"
            :vs-text="type.name"
          />
        </vs-select>

        <vs-input
          vs-label="Адрес"
          vs-type="text"
          v-model.trim="address"
        />
        
        <div class="mb-15">
          Дата окончания
          <datepicker
            v-model="selectDate"
            :language="russianLocale"
            input-class="datepicker-custom"
          />
        </div>

        <textarea v-model.trim="description" rows="5" placeholder="Описание"/>

        <vs-button
          vs-color="primary"
          vs-type="filled"
          @click="addIssue"
        >
          Создать заявку
        </vs-button>

      </vs-card-body>
    </vs-card>

  </div>
</template>

<script>
import db from '../plugins/firebaseInit.js'
import { ru } from 'vuejs-datepicker/dist/locale'
// Категории работ
import category from '../plugins/category.js'

export default {
  name: 'AddIssues',
  components: {
    Datepicker: () => import('vuejs-datepicker')
  },
  data: () => ({
    // Локализация дат
    russianLocale: ru,

    // Название заявки
    name: '',
    
    // Адрес
    address: '',

    // Описание
    description: '',

    // Дата выполнения
    selectDate: '',

    // Тип заявки
    type: '',

    // Список категорий
    types: category
  }),
  computed: {
    // Id пользователя
    authorId() {
      return this.$store.getters.userId
    },
  },
  methods: {
    showNotificacion({ title, text, color = 'primary' }) {
      this.$vs.notify({ title, text, color })
    },

     addIssue() {
      const data = {
        name: this.name,
        description: this.description,
        address: this.address,
        date: this.selectDate,
        type: this.type,
        author: this.$store.state.user.email,
        authorId: this.authorId
      }

      db.collection('issues').add(data)
        .then(docRef =>{
          this.$router.push(`/issue/${docRef.id}`)
        })
        .catch(error => this.showNotificacion({
          title: 'Ошибка при создание заявки!',
          text: error,
          color: 'danger'
        }))
    }
  }
}
</script>

<style>
.datepicker-custom {
  margin-bottom: 0;
  color: inherit;
  position: relative;
  padding: .4rem;
  border-radius: 5px;
  border: 1px solid rgba(0,0,0,.2);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-shadow: 0 0 0 0 rgba(0,0,0,.15);
  box-shadow: 0 0 0 0 rgba(0,0,0,.15);
  -webkit-transition: all .3s ease;
  transition: all .3s ease;
  width: 100%;
}

.datepicker-custom:focus {
  box-shadow: 0 3px 10px 0 rgba(0,0,0,.15);
  border: 1px solid #1f74ff!important;
}
</style>
