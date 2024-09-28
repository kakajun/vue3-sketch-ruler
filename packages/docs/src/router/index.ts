import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
export const menuRoutes: RouteRecordRaw[] = [
  {
    path: 'basic',
    component: () => import('../examples/basic.vue')
  }
  // {
  //   path: 'temp',
  //   component: () => import('@/examples/temp.vue'),
  //   meta: {
  //     title: 'temp'
  //   }
  // }
]

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Home,
    redirect: '/basic',
    children: menuRoutes
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
