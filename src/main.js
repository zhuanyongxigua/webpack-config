import Vue from 'vue'
import router from './router'
import iView from 'iview'
import axios from 'axios'
import 'iview/dist/styles/iview.css'
import '../public/system.css'
import Util from './libs/util'
import { BASEURL } from './libs/util'
import env from './config/env'
// import App from './App.vue'

Vue.use(iView)

document.addEventListener('click', Util.addRippleEffect, false);

if (env === 'development') {
  axios.defaults.withCredentials = true
  Vue.config.performance = true
  Vue.config.productionTip = false
}
axios.defaults.baseURL = BASEURL
axios.interceptors.response.use(res => {
  if (typeof res.data === 'string' && res.data.indexOf('loginTimeOut') !== -1) {
    root.$router.push('login')
  }
  return res
}, err => {
  return Promise.reject(err)
})

let root = new Vue({
  router,
  render: h => h('router-view')
  // render: h => h(App)
}).$mount('#app')
