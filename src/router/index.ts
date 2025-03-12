import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../components/Welcome.vue'
import MbtiMatch from '../components/MbtiMatch.vue'
import EventPlanner from '../components/EventPlanner.vue'

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
  },
  {
    path: '/event-planner',
    name: 'event-planner',
    component: EventPlanner
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 