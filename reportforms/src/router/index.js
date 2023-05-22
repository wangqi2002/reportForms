import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    children: [{
      path: 'luckysheet',
      name: 'luckysheet',
      component: () => import('@/components/Luckysheet'),
    }]
  },
  // {
  //   path: '/',
  //   name: 'Luckysheet',
  //   component: () => import('@/components/Luckysheet'),
  // },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
