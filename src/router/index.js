import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import GiftManagement from '../views/GiftManagement.vue'
import SliderManagement from '../views/SliderManagement.vue'
import PaperManagement from '../views/PaperManagement.vue'
import ThreeDManagement from '../views/ThreeDManagement.vue'
import AppConfigView from '../views/AppConfigView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/gifts',
    name: 'Gifts',
    component: GiftManagement
  },
  {
    path: '/sliders',
    name: 'Sliders',
    component: SliderManagement
  },
  {
    path: '/papers',
    name: 'Papers',
    component: PaperManagement
  },
  {
    path: '/threed',
    name: 'ThreeD',
    component: ThreeDManagement
  },
  {
    path: '/appconfig',
    name: 'AppConfig',
    component: AppConfigView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
