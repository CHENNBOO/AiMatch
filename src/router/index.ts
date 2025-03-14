import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import PersonalityMatch from '../components/PersonalityMatch.vue'
import EventPlanner from '../components/EventPlanner.vue'
import MentalHealth from '../components/MentalHealth.vue'
import CommunicationGuide from '../components/CommunicationGuide.vue'
import VirtualInteraction from '../components/VirtualInteraction.vue'

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
  history: createWebHistory(),
  routes
})

export default router 