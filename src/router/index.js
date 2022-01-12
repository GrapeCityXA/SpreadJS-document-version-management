import * as VueRouter from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/MainList'
  },
  {
    path: '/MainList',
    name: 'MainList',
    component: () => {
      console.log('Router to MainList')
      return import('../components/MainList/MainList.vue')
    }
  },
  {
    path: '/Excel',
    name: 'Excel',
    component: () => {
      console.log('Router to Excel')
      return import('../components/Excel/Excel.vue')
    }
  }
]

export default VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
})
