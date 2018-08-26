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

        <label>Тип заявки</label>
        <vs-select
          class="selectExample"
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
          <label>Дата окончания</label>
          <datepicker
            v-model="selectDate"
            :language="russianLocale"
            :disabledDates="disabledDates"
            input-class="datepicker-custom"
          />
        </div>

        <label>Описание</label>
        <textarea v-model.trim="description" rows="5" placeholder="..."/>

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
    types: category,

    // Ограничения минимальной даты  
    disabledDates: {
      to: new Date()
    }
  }),
  computed: {
    // Id пользователя
    authorId() {
      return this.$store.getters.userId
    },

    // Имя автора заявки
    author() {
      return this.$store.getters.userName
    },
  },
  methods: {
    // Проверить заполненность формы
    validateForm() {
      if (!this.name) {
        this.showHint('Заполните поле - Название заявки')
        return false
      }

      if (!this.address) {
        this.showHint('Заполните поле - Адрес')
        return false
      }

      if (!this.selectDate) {
        this.showHint('Заполните поле - Дата')
        return false
      }

      if (!this.description) {
        this.showHint('Заполните поле - Описание')
        return false
      }

      return true
    },

    // Показать подсказку
    showHint(text) {
      this.$vs.notify({
        title: 'Корректно заполните форму!',
        color: 'danger',
        text
      })
    },

    // Создать заявку
    addIssue() {
      if (!this.author) {
        this.$vs.notify({
          title: 'Ошибка при создание заявки!',
          text: 'Укажите имя в настройках аккаунта',
          color: 'danger'
        })
        return
      }

      if (!this.validateForm()) {
        return
      }

      const data = {
        name: this.name,
        description: this.description,
        status: 'open',
        address: this.address,
        date: this.selectDate,
        type: this.type,
        author: this.author,
        authorId: this.authorId
      }

      db.collection('issues').add(data)
      .then(docRef =>{
        this.$router.push(`/issue/${docRef.id}`)
      })
      .catch(error => this.$vs.notify({
        title: 'Ошибка при создание заявки!',
        text: error.message || error,
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
