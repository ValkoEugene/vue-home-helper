import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'

import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Signin from '../pages/SignIn.vue'
import AccountSettings from '../pages/AccountSettings.vue'
import Issues from '../pages/Issues.vue'
import Issue from '../pages/Issue.vue'
import AddIssue from '../pages/AddIssue.vue'
import Masters from '../pages/Masters.vue'
import Master from '../pages/Master.vue'
import Faq from '../pages/Faq.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/signin', component: Signin },
  { path: '/faq', component: Faq },
  { path: '/account-settings', component: AccountSettings, meta: { requiresAuth: true } },
  { path: '/masters', component: Masters },
  { path: '/master/:id', name: 'master', component: Master },
  { path: '/issues', component: Issues },
  { path: '/issue/:id', name: 'issue', component: Issue },
  { path: '/add-issue', component: AddIssue, meta: { requiresAuth: true } }
]

const route = new VueRouter({
  routes,
  mode: 'history'
})

route.beforeEach((to, from, next) => {
  const user =  firebase.auth().currentUser
  const requiresAuth = to.meta.requiresAuth

  if (!user && requiresAuth) {
    next('login')
  } else {
    next()
  }
})

export default route