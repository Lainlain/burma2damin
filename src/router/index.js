import { createRouter, createWebHistory } from 'vue-router'

// Lazy load routes for better initial page load performance
const Dashboard = () => import('../views/Dashboard.vue')
const GiftManagement = () => import('../views/GiftManagement.vue')
const SliderManagement = () => import('../views/SliderManagement.vue')
const PaperManagement = () => import('../views/PaperManagement.vue')
const ThreeDManagement = () => import('../views/ThreeDManagement.vue')
const AppConfigView = () => import('../views/AppConfigView.vue')

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
