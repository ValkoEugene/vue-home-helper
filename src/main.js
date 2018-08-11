import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import store from './store'
import db from './plugins/firebaseInit.js'

Vue.config.productionTip = false

let app = null


// TODO: переделать без querySnaphot.forEach т.к. там один объект
function getUserInfo(uid) {
  db.collection('users')
    .where('userId', '==', uid)
    .get()
    .then(querySnaphot => {
      querySnaphot.forEach(doc => {
        const userInfo = {
          name: doc.data().name,
          accountType: doc.data().accountType,
          age: doc.data().age || '',
          city: doc.data().city || '',
          description: doc.data().description || ''
        }

        if (userInfo.accountType === 'master') {
          userInfo.experience = doc.data().experience
          userInfo.category = doc.data().category
          userInfo.phone = doc.data().phone
        }

        store.commit('setUser', Object.assign({}, store.state.user, userInfo))
      })
    })
    .catch(error => console.error('Ooops', error))
}

firebase.auth().onAuthStateChanged(user => {
  if (user !== null) {
    store.commit('setUser', {
      name: user.displayName,
      email: user.email,
      photoUrl: user.photoURL,
      emailVerified: user.emailVerified,
      uid: user.uid
    })

    getUserInfo(user.uid)
  }

  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
