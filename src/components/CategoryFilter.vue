<template>
  <div class="category-filter">
    <vs-card>
      <vs-card-body>
        <h3>Фильтр</h3>
        
        <ul class="leftx">
          <li>
            <vs-radio v-model="curentFilter" vs-value="all">
              Все
            </vs-radio>
          </li>
          <li v-for="filter in filters" :key="filter.id">
            <vs-radio v-model="curentFilter" :vs-value="filter.id">
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
  data: () => ({
    // Фильтр по категория
    filters: category,

    // Выбранная категория
    curentFilter: 'all'
  }),
  watch: {
    curentFilter: 'changeCurentFilter'
  },
  mounted() {
    // Изначально активны все категории
    this.changeCurentFilter('all')
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
