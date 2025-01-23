// env.js
const API_ROOT = 'http://www.munjie.com/blog/'
const API_ROOT_DEV = 'http://localhost:8090/blog/'

export default {
  apiUrl: (process.env.NODE_ENV === 'production' ? API_ROOT : API_ROOT_DEV)
}
