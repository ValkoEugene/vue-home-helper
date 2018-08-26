<template>
  <div class="phone">
    <div class="phone-shade"></div>
    
    <div class="phone-speaker"></div>
    
    <div class="phone-screen">
      
      <div class="phone-header">
        <div class="phone-menu"></div>
      </div>

      <div class="phone-content">
        <div class="issues-phone-cards">
          <vs-card>
            <vs-card-header
              vs-title="Сварочные работы"
              :vs-fill="true"
              vs-background-color="success"
            >
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
      
    </div>
    
    <div class="phone-button"></div>
  </div>
</template>

<script>
export default {
  name: 'Phone'
}
</script>

<style scoped>

*,
*:before,
*:after {
  box-sizing: border-box;
}

.phone {
  margin: 10px auto;
}

.clear {
  clear: both;
}

.phone {
  height: 428px;
  width: 226px;
  background: #415260;
  border-radius: 50px;
  position: relative;
  overflow: hidden;
}
.phone .phone-shade {
  position: absolute;
  height: 500px;
  width: 200px;
  left: 50%;
  background: #555f6b;
  -webkit-transform: rotate(18deg);
          transform: rotate(18deg);
}
.phone .phone-speaker {
  height: 8px;
  width: 42px;
  border-radius: 4px;
  background: #3e4752;
  position: relative;
  top: 23px;
  left: 50%;
  margin-left: -21px;
}

.phone-button {
  height: 40px;
  width: 40px;
  background: #49525b;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  margin-left: -20px;
  bottom: 10px;
}

.phone-screen {
  height: 302px;
  width: 208px;
  background: #f2ebe2;
  position: absolute;
  left: 9px;
  top: 58px;
  overflow: hidden;
}

.phone-header {
  width: 100%;
  height: 30px;
  background: #1e1e1e;
  position: relative;
  z-index: 3;
  color: white;
}
.phone-header .phone-menu {
  position: absolute;
  right: 10px;
  top: 9px;
  background: white;
  width: 15px;
  height: 2px;
}
.phone-header .phone-menu:before {
  content: "";
  width: 15px;
  height: 2px;
  top: 5px;
  background: #f2ebe2;
  position: absolute;
}
.phone-header .phone-menu:after {
  content: "";
  width: 15px;
  height: 2px;
  top: 10px;
  background: #f2ebe2;
  position: absolute;
}

.phone-content{
  height: 272px;
  width: 100%;
  background: #f0f0f0;
}

.issues-phone-cards {
  padding: 10px;
  font-size: 12px!important;
  height: 900px;
  animation: scroll  35s infinite linear;
}

@keyframes scroll {
  from { transform: translateY(0); }
  50% { transform: translateY(-650px); }
  to { transform: translateY(0); }
}
</style>
