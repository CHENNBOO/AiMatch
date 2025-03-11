import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../components/Welcome.vue'
import MbtiMatch from '../components/MbtiMatch.vue'

const routes = [
  {
    path: '/',
    name: '欢迎',
    component: Welcome
  },
  {
    path: '/mbti',
    name: 'MBTI性格匹配',
    component: MbtiMatch
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 