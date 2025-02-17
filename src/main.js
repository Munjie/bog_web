
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store/index'
import { sync } from 'vuex-router-sync'
import validator from 'UTIL/validator'
import Highlight from 'UTIL/mHighlight'
import photoPreview from 'COMMON/photoPreview'
import 'UTIL/filters'
import VueParticles from 'vue-particles'
import axios from 'axios'
Vue.prototype.$axios = axios

if (process.env.NODE_ENV === 'development') {
  require('./ElementUI')
}
// eslint-disable-next-line import/first
import * as moment from 'moment'
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
  components: { App }
})
