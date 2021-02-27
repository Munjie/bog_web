/*
import Vue from 'vue'
import moment from 'moment'

const time = (value, formatString = 'YYYY-MM-DD HH:mm') => {
  return moment(parseInt(value) * 1000).format(formatString)
}

Vue.filter('time', time)

export default Vue
*/
// 1. 导入Vue
import Vue from 'vue'
// 导入格式化时间的模块
import moment from 'moment'

// 定义全局的时间过滤器
Vue.filter('dateFormat', function (dateStr, formatStr = 'YYYY-MM-DD HH:mm:ss') {
  // 在过滤器的处理函数中，最后，必须 return 一个东西，这样，才是一个合法的过滤器
  return moment(dateStr).format(formatStr)
})
