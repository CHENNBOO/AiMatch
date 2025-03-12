import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../components/Welcome.vue'
import MbtiMatch from '../components/MbtiMatch.vue'
import EventPlanner from '../components/EventPlanner.vue'
import MentalHealth from '../components/MentalHealth.vue'
import CommunicationGuide from '../components/CommunicationGuide.vue'
import VirtualInteraction from '../components/VirtualInteraction.vue'

const routes = [
  {
    path: '/',
    redirect: '/mbti'
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
  },
  {
    path: '/mental-health',
    name: 'MentalHealth',
    component: MentalHealth
  },
  {
    path: '/communication-guide',
    name: 'communication-guide',
    component: CommunicationGuide
  },
  {
    path: '/virtual-interaction',
    name: 'virtual-interaction',
    component: VirtualInteraction
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 