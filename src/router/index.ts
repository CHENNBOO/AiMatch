import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import PersonalityMatch from '../components/PersonalityMatch.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/personality',
    name: '性格匹配',
    component: PersonalityMatch
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 