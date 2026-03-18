import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import CustomerOrderView from '../views/CustomerOrderView.vue'
import ConfigureDashboard from '../views/ConfigureDashboard.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: DashboardView },
  { path: '/orders', component: CustomerOrderView },
  { path: '/configure', component: ConfigureDashboard },
]

export default createRouter({
  history: createWebHistory(),
  routes
})