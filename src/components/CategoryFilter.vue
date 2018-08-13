<!-- Компонент с филтром по категориям -->

<template>
  <div class="category-filter">
    <vs-card>
      <vs-card-body>
        <h3>Фильтр</h3>
        
        <ul class="leftx">
          <li>
            <vs-radio
              @click.prevent="changeCurentFilter('all')"
              :value="curentFilter"
              vs-value="all"
            >
              Все
            </vs-radio>
          </li>

          <li v-for="filter in filters" :key="filter.id">
            <vs-radio
              @click.prevent="changeCurentFilter(filter.id)"
              :value="curentFilter"
              :vs-value="filter.id"
            >
              {{ filter.name }}
            </vs-radio>
          </li>
        </ul>
      </vs-card-body>
    </vs-card>
  </div>
</template>

<script>
// Категории работ
import category from '../plugins/category.js'

export default {
  name: 'CategoryFilter',
  model: {
    // Привязываем значение фильтра через v-model на компоненте
    prop: 'curentFilter',
    event: 'changeCurentFilter'
  },
  props: {
    // Кастомные значения для фильтра
    customFilters: {
      type: Array,
      default: () => ([])
    },

    // Выбранная категория
    curentFilter: {
      type: String,
      default: 'all'
    }
  },
  data: () => ({
    // Фильтр по категории
    filters: category
  }),
  watch: {
    curentFilter: 'changeCurentFilter'
  },
  mounted() {
    // добавляем касотмные категории
    this.filters = [...this.filters, ...this.customFilters]
  },
  methods: {
    // Смена текущего фильтра
    changeCurentFilter(id) {
      this.$emit('changeCurentFilter', id)
    }
  }
}
</script>

<!-- Без scoped т.к. необходимо переопределить стили шаблона vuesax -->
<style>
.category-filter ul {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  list-style: none;
}

.category-filter ul li{
  margin: 5px;
}
</style>
