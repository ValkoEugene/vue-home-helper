<template>
  <div class="home">

    <div class="about-wrapper">
      <div class="about">
        <h2>Найти исполнителя для дел по дому - просто!</h2>

        <ul>
          <li>Зарегистрируйтесь как заказчик</li>
          <li>Разместите заявку</li>
          <li>Мастера сами будут предлагать свою услги</li>
          <li>Выберите подходящее предложение</li>
        </ul>

        <vs-button
          v-if="!isAuth"
          vs-color="primary"
          vs-type="relief"
          class="login-button"
          @click="goToLogin"
        >
          Вход
        </vs-button>
      </div>

      <phone />
    </div>

    <div class="issues">
      <div class="masters-title">
        <h3>Найти клиентов <span>просто!</span></h3>

        <p>Множество клиентов оставляют свои заявки, откликайтесь собирйте отзывы, повышайте рейтинг</p>
      </div>

      <h2>Множество заявок для мастеров!</h2>

      <div class="issues-cards">
        <vs-card>
          <vs-card-header
            vs-title="Сварочные работы"
            :vs-fill="true"
            vs-background-color="success"
          >
            <vs-avatar vs-size="large" vs-text="Иван Иванович"/>
          </vs-card-header>

          <vs-card-body>
            <div>
              <vs-chip vs-color="success">
                Открыта
              </vs-chip>
              <vs-chip vs-color="success">
                Отклики: 2
              </vs-chip>

              <h4 class="mt-15">Автор:</h4>
              <p>Иван Иванович</p>

              <h4 class="mt-15">Дата окончания:</h4>
              <p>02.08.2018</p>

              <h4 class="mt-15">Описание:</h4>
              <p>На строительном объекте монтаж пожарного трубопровода и частично водопровода объём работ на 8—10 дней для одного специалиста. Оборудование и расходные материалы в наличии у заказчика.</p>
            </div>

          </vs-card-body>
        </vs-card>

        <vs-card>
          <vs-card-header
            vs-title="Перееезд"
            :vs-fill="true"
            vs-background-color="success"
          >
            <vs-avatar vs-size="large" vs-text="Пётр Смиронов"/>
          </vs-card-header>

          <vs-card-body>
            <div>
              <vs-chip vs-color="success">
                Открыта
              </vs-chip>
              <vs-chip vs-color="success">
                Отклики: 4
              </vs-chip>

              <h4 class="mt-15">Автор:</h4>
              <p>Пётр Смиронов</p>

              <h4 class="mt-15">Дата окончания:</h4>
              <p>13.08.2018</p>

              <h4 class="mt-15">Описание:</h4>
              <p>Нужны грузчики. Сам не буду носить, спина больная. Хабарова 5. забрать холодильник, поехать на Федора Попова 2/2 Оттуда забрать матрас и легкую кровать. увезти все на жорницкого 7/32а оттуда забрать кухню (собранная) диван угловой разборный,2 стола, 4 стула, раковину со шкафчиком, стиралку, другой холодильник. Затем поехать на Федора Попова 2/2.</p>
            </div>

          </vs-card-body>
        </vs-card>
      </div>
    </div>

    <div class="footer">
      <h2>Home helper</h2>
      <h1>
        Оставляйте заявки и находите лучших мастреров, откликайтесь на заявки и находите клиентов!
      </h1>

      <p>Регистрируйтесь и получите результат в тот же день</p>

      <vs-button
        v-if="!isAuth"
        vs-color="primary"
        vs-type="relief"
        class="login-button"
        @click="goToLogin"
      >
        Вход
      </vs-button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
    Phone: () => import('../components/Phone.vue')
  },
  computed: {
    // Флаг того что пользователь залогинен
    isAuth() {
      return this.$store.getters.isAuth
    }
  },
  methods: {
    // Перейти на страницу с login
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.about-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: -20px;
  background: #ffde5f;
  padding: 50px;
  box-sizing: border-box;
  height: 100vh;
}

.about {
  width: calc(100vw - 400px);
  background: #663399;
  color: white;
  padding: 52px;
  border-radius: 15px;
}

.about h2 {
  font-size: 38px;
}

.about ul {
  margin: 20px;
  font-size: 20px;
}

.about ul li{
  margin: 10px;
}

.login-button {
  padding: 10px 50px;
}

.masters-title {
  width: 80%;
  background: white;
  padding: 50px;
  margin: auto;
  margin-top: -25px;
  box-shadow: 0 20px 40px -8px rgba(0,0,0,.1);
}

.masters-title h3 {
  color: #1f74ff;
  font-size: 32px;
  text-align: center;
}

.masters-title p {
  font-size: 24px;
  text-align: center;
}

.issues h2{
  font-size: 38px;
  text-align: center;
  margin-top: 50px;
}

.issues-cards {
  display: flex;
  padding: 35px;
}

.footer {
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 50px;
}

.footer h2 {
  font-size: 65px;
  color: #663399;
  opacity: 0.8;
} 

.footer h1 {
  font-size: 42px;
} 

.footer p {
  font-size: 24px;
  margin: 25px; 
}

@media only screen and (max-width: 768px){
  .about-wrapper {
    padding: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    height: auto;
    margin-bottom: 100px;
    padding-top: 50px;
  }

  .about {
    width: 90%;
    margin: 50px;
    padding: 20px;
  }

  .about h2 {
    font-size: 24px;
  }


  .about ul {
    margin: 10px;
    font-size: 18px;
  }

  .about ul li{
    margin: 10px;
  }

  .login-button {
    padding: 10px 30px;
  }

  .masters-title {
    padding: 25px;
  }

  .masters-title h3 {
    font-size: 24px;
  }

  .masters-title p {
    font-size: 18px;
  }

  .issues h2{
    font-size: 24px;
    text-align: center;
    margin-top: 25px;
    padding: 10px;
  }

  .issues-cards {
    flex-direction: column;
  }

  .footer {
    padding: 25px;
  }

  .footer h2 {
    font-size: 30px;
  } 

  .footer h1 {
    font-size: 22px;
  } 

  .footer p {
    font-size: 18px;
    margin: 25px; 
  }
}
</style>
