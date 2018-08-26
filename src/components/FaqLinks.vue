<template>
  <div>
    <h3 class="mb-15">FAQ</h3>
        
    <div class="faq-content">
      <router-link to="/faq?selected_tab=add_issue" class="faq-item">
        Как оставить заявку
      </router-link>

      <router-link to="/faq?selected_tab=how_become_master" class="faq-item">
        Как стать мастером
      </router-link>

      <router-link to="/faq?selected_tab=issues" class="faq-item">
        Заявки
      </router-link>

      <router-link to="/faq?selected_tab=masters" class="faq-item">
        Мастера
      </router-link>
    
    </div>
  </div>
</template>

<script>
export default {
  name: 'faq'
}
</script>

<style scoped>
.faq-item {
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 20px 40px -8px rgba(0,0,0,.1);
  border-radius: 8px;
  cursor: pointer;
}
</style>

