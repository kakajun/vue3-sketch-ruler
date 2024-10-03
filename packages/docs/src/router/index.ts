import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
export const menuRoutes: RouteRecordRaw[] = [
  {
    path: 'basic',
    component: () => import('../examples/basic.vue'),
    meta: {
      title: 'basic'
    }
  },
  {
    path: 'comprehensive',
    component: () => import('../examples/comprehensive.vue'),
    meta: {
      title: 'comprehensive'
    }
  },
  {
    path: 'comprehensive2',
    component: () => import('../examples/comprehensive2.vue'),
    meta: {
      title: 'comprehensive2'
    }
  },
  {
    path: 'customizeButtons',
    component: () => import('../examples/customizeButtons.vue'),
    meta: {
      title: 'customizeButtons'
    }
  },
  {
    path: 'moveble',
    component: () => import('../examples/moveble.vue'),
    meta: {
      title: 'moveble'
    }
  },
  {
    path: 'selecto',
    component: () => import('../examples/SelectoDemo.vue'),
    meta: {
      title: 'Selecto'
    }
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
    redirect: '/comprehensive',
    children: menuRoutes
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
