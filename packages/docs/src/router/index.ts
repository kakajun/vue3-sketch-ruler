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
    path: 'basic2',
    component: () => import('../examples/basic2.vue'),
    meta: {
      title: 'basic2'
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
      title: 'selecto'
    }
  },

  {
    path: 'input',
    component: () => import('@/examples/input.vue'),
    meta: {
      title: 'input'
    }
  },
  {
    path: 'bigscreen',
    component: () => import('@/examples/bigscreen/bigscreen.vue'),
    meta: {
      title: 'bigscreen'
    }
  },
  {
    path: '8k',
    component: () => import('@/examples/bigscreen/8K.vue'),
    meta: {
      title: '8k'
    }
  },
  {
    path: 'sketch-ruler',
    component: () => import('@/examples/bigscreen/8Ksketch-ruler.vue'),
    meta: {
      title: 'sketch-ruler'
    }
  },
  {
    path: 'multi-instance',
    component: () => import('@/examples/multi-instance.vue'),
    meta: {
      title: 'multi-instance'
    }
  },
  {
    path: 'flow-editor',
    component: () => import('../examples/flow-editor.vue'),
    meta: {
      title: 'flow-editor'
    }
  },
  {
    path: 'whiteboard',
    component: () => import('../examples/whiteboard.vue'),
    meta: {
      title: 'whiteboard'
    }
  },
  {
    path: 'topology',
    component: () => import('../examples/topology.vue'),
    meta: {
      title: 'topology'
    }
  },
  {
    path: 'org-chart',
    component: () => import('../examples/org-chart.vue'),
    meta: {
      title: 'org-chart'
    }
  }
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
