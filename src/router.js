import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/index.vue'
import Login from './views/login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', redirect: '/index'},
    {
      path: '/index',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Index,
      children: [
        {path: '/', redirect: '/usersInfo'},
        {
          path: '/usersInfo',
          component: () => import('./views/usersInfo.vue'),
          meta: {
            index: 1
          }
        },
        {
          path: '/teach',
          component: () => import('./views/teach.vue'),
          meta: {
            index: 2
          }
        },
        {
          path: '/articles',
          component: () => import('./views/articles.vue'),
          meta: {
            index: 3
          }
        },
        {
          path: '/mall',
          component: () => import('./views/mall.vue'),
          meta: {
            index: 4
          }
        },
        {
          path: '/orders',
          component: () => import('./views/orders.vue'),
          meta: {
            index: 5
          }
        },
        {
          path: '/afterSale',
          component: () => import('./views/afterSale.vue'),
          meta: {
            index: 6
          }
        },
        {
          path: '/manage',
          component: () => import('./views/manage.vue'),
          meta: {
            index: 7
          }
        },
      ]
    },
    {
      path: '/login',
      component: Login
    }
  ]
})
