<template>
  <div class="home-helper__wrapper">
    <h1>FAQ</h1>

    <vs-card>
      <vs-card-body>

        <vs-tabs ref="tab">
          <vs-tab vs-label="Как оставить заявку">
            <div class="con-tab-ejemplo">
              <p>Если вы уже зарегистрированы, оставить заявку без лишних преувеличений можно буквально за 30 секунд! Однако, даже вместе с процессом регистрации это займет не больше пары минут.</p>

              <p>1. Перейдити на пункт меню «Оставить заявку». Перед вами откроется страница создания заявки.</p>
              <img src="../../public/img/1.1.png" alt="Страница Оставить заявку">

              <p>2. В поле «Название заявки» напишите суть работы, например «Установить кран».</p>
              <img src="../../public/img/1.2.png" alt="поле Название заявки">

              <p>3. В поле «Тип заявки» укажите к какой категории относится ваша заявка.</p>
              <img src="../../public/img/1.3.png" alt="поле Тип заявки">

              <p>4. В поле «Адрес» укажите по какому адресу необходимо проводить работу.</p>
              <img src="../../public/img/1.4.png" alt="поле Адрес">

              <p>5. В поле «Дата окончания» укажите до какого числа актуальна ваша заявка. (Начиная с текущей даты)</p>
              <img src="../../public/img/1.5.png" alt="поле Дата окончания">

              <p>6. В поле «Описание» можете описать подробности. Чем лучше будет описана задача тем лучше, но если работа простая можно обойтись и парой фраз.</p>
              <img src="../../public/img/1.6.png" alt="поле «Описание»">

              <p>7. После этого нажав кнопку «Создать заявку» заявка будет создана и вас переведёт на страницу заявки.</p>
              <img src="../../public/img/1.7.png" alt="страница заявки">
            </div>
          </vs-tab>

          <vs-tab vs-label="Как стать мастером">
            <div class="con-tab-ejemplo">
              <p>1. Для того чтобы стать мастером необходимо при регистрации выбрать Тип аккаунта - Мастер</p>
              <img src="../../public/img/2.1.png" alt="регистрация аккаунта мастера">

              <p>2. Далее необходимо перейти на страницу «Настройки аккаунта»</p>
              <img src="../../public/img/2.2.png" alt="Настройки аккаунта">

              <p>3. Заполните поле Возраст</p>
              <img src="../../public/img/2.3.png" alt="поле Возраст">

              <p>4. Укажите Ваш город</p>
              <img src="../../public/img/2.4.png" alt="Ваш город">

              <p>5. Заполните инфорамцию о себе</p>
              <img src="../../public/img/2.5.png" alt="о себе">

              <p>6. Укажите телефон</p>
              <img src="../../public/img/2.6.png" alt="телефон">

              <p>7. Укажите Ваш опыт</p>
              <img src="../../public/img/2.7.png" alt="опыт">

              <p>8. Выберете категорию с которой будете связаны</p>
              <img src="../../public/img/2.8.png" alt="категории">
            </div>
          </vs-tab>

          <vs-tab vs-label="Заявки">
            <div class="con-tab-ejemplo">
              <p>1. На странице Заявки можно посмотреть все заявки оставленные в системе.</p>
              <img src="../../public/img/3.1.png" alt="Страница заявки">

              <p>
                2. На карточке заявки отображается основная информация.
                Статус открыта/закрыта (закрыта - если выбран исполнитель).
                Количетсво откликов (сколько мастеров откликнулись на данную заявку).
                Информация о том является ли заявка просроченной.
              </p>
              <img src="../../public/img/3.2.png" alt="Карточка заявки">

              <p>3. На странице заявки мастера могут оставлять отклики к заявке</p>
              <img src="../../public/img/3.3.png" alt="отклики">

              <p>3. После выбора клиентом мастера заявка перейдет в статус закрыта и клиенту будет показан номер мастера.</p>
              <img src="../../public/img/3.4.png" alt="выбранный мастер">
            </div>
          </vs-tab>

          <vs-tab vs-label="Мастера">
            <div class="con-tab-ejemplo">
              <p>1. На странице Мастера можно посмотреть всех мастеров зарегистрированных в системе.</p>
              <img src="../../public/img/4.1.png" alt="страница Мастеров">

              <p>2. На странице с инфорамцией о мастере можно посмотреть основную информацию, отзывы и рейтинг мастера.</p>
              <img src="../../public/img/4.2.png" alt="страница Мастера">

              <p>3. Если Вы выбрали мастера как исполнителя, Вы можете оставить отзыв и указать оценку работе мастера.</p>
              <img src="../../public/img/4.3.png" alt="отзывы Мастера">

              <p>4. После этого отзыв будет добавлен и изменится общий рейтинг мастера.</p>
              <img src="../../public/img/4.4.png" alt="рейтинг Мастера">
            </div>
          </vs-tab>
        </vs-tabs>

      </vs-card-body>
    </vs-card>
  </div>
</template>

<script>
export default {
  name: 'Faq',
  data: () => ({
    // Список табов
    tabs: ['add_issue', 'how_become_master', 'issues', 'masters']
  }),
  computed: {
    // Таб из URL
    tabFromQuery() {
      return this.$route.query.selected_tab
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.tabFromQuery) {
        this.selectTab(this.tabFromQuery)
      }
    })
  },
  methods: {
    // Выбрать таб
    // (в теме vuesax нет механизма програмно выбирать табы, поэтому имитируем клик через чистый js)
    selectTab(selectedTab) {
      const index = this.tabs.indexOf(selectedTab)
      const tab = this.$refs.tab.$el
      const buttonWrapper = tab.querySelector('.ul-tabs').children[index]
      const button = buttonWrapper.querySelector('button')
      button.click()
    }
  }
}
</script>

<style scoped>
p {
  margin: 10px;
}

img {
  width: 100%;
  padding: 15px;
}
</style>
