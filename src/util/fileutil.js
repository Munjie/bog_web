// 下载文件，添加请求头

import axios from 'axios'
import qs from 'qs'
export default function downLoadFile (url, method = 'get', params = {}) {
  debugger
  axios({
    method,
    url,
    params,
    responseType: 'blob',
    // 解决get传参中有数组的情况
    paramsSerializer: function (params) {
      return qs.stringify(params, { indices: false })
    }
  }).then(res => {
    // 导出文件
    // 通过a标签打开新页面下载文件
    const a = document.createElement('a')
    // 构造一个blob对象来处理数据
    const blob = new Blob([res.data])
    if (res.headers['content-disposition']) {
      // 拿到用户上传的文件名
      let fileName = res.headers['content-disposition']
      let length = fileName.split('=').length
      // 截取=之后的字符串
      if (length > 2) {
        fileName = fileName.split('=')[1].split(';')[0]
      } else {
        fileName = fileName.substring(fileName.lastIndexOf('='))
        fileName = fileName.substring(1)
      }
      gbkconvert(fileName, (res) => {
        fileName = res
        // URL.createObjectURL()会产生一个url字符串，可以像使用普通 URL 那样使用它，比如用在 img.src 上
        a.href = URL.createObjectURL(blob)
        // a标签里有download属性可以自定义文件名
        a.setAttribute(
          'download',
          fileName
        )
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      })
    }
  })
}
// 将'%E6%B4%9B%E5%8D%97%E5%8E%BF%E5%B1%B1%E6%B4%AA%E7%81%BE%E5%AE%B3%E9%98%B2%E5%BE%A1%E9%A2%84%E6%A1%88'转换为中文
function gbkconvert (gbkStr, callback) {
  var script = document.createElement('script')
  script.id = 'gbkconvert'
  script.src = 'data:text/javascript;charset=utf-8,gbkconvertCb("' + gbkStr + '");'
  document.body.appendChild(script)
  window.gbkconvertCb = (res) => {
    callback && callback(res)
  }
}
