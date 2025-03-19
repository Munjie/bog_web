import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/index'
import {sync} from 'vuex-router-sync'
import validator from 'UTIL/validator'
import Highlight from 'UTIL/mHighlight'
import photoPreview from 'COMMON/photoPreview'
import 'UTIL/filters'
import VueParticles from 'vue-particles'
import axios from 'axios'
axios.interceptors.response.use(response => {
  console.log("response====>" + response.data)
  if (response.data.code === 1003) {
    removeAccessToken()
    cachedAdminInfo.delete()
    // alert('登录已过期请重新登录')
    //弹出登录窗口
    store.commit(IS_LOGIN, false)
    return Promise.reject(response.data)
  }
  return response.data
}, error => {
    return Promise.reject(error)
})
axios.interceptors.request.use(
  config => {
    let token = getAccessToken();
    if (token) {
      config.headers.token = token;
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 全局处理未捕获的 Promise 拒绝
window.addEventListener('unhandledrejection', event => {
  const error = event.reason
  console.warn('全局捕获未处理的Promise错误:', error)
  event.preventDefault() // 防止控制台报 Uncaught (in promise)
})


Vue.prototype.$axios = axios

if (process.env.NODE_ENV === 'development') {
  require('./ElementUI')
}
// eslint-disable-next-line import/first
import * as moment from 'moment'
import {cachedAdminInfo, getAccessToken, removeAccessToken} from "./api/cacheService";
import {IS_LOGIN, SHOW_TOKEN_ERROR} from "./store/mutation-types";

Vue.use(moment)
Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(validator)
Vue.use(Highlight)
Vue.use(photoPreview)
Vue.use(VueParticles)
// Vue.use(live2d)
// Vue.use(axios)

Vue.toast = Vue.prototype.$toast = (msg, type = 'success') => {
  Vue.prototype.$message({
    showClose: true,
    message: msg,
    type: type
  })
}

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
