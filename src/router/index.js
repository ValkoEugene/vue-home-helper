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

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/signin', component: Signin },
  { path: '/account-settings', component: AccountSettings },
  { path: '/masters', component: Masters, meta: { requiresAuth: true } },
  { path: '/issues', component: Issues, meta: { requiresAuth: true } },
  { path: '/issue/:id', name: 'issue', component: Issue, meta: { requiresAuth: true } },
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