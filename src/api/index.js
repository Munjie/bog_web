import axios from 'axios'
import Qs from 'qs'
import { Message } from 'element-ui'
import {
  getAccessToken,
  removeAccessToken,
  cachedAdminInfo
} from '../api/cacheService'

import {
  IS_LOGIN,
  SHOW_TOKEN_ERROR
} from '../store/mutation-types'
import ElementUI from "../ElementUI";

/* eslint-disable */
const API_ROOT = 'http://www.munjie.com/blog/'
const API_ROOT_DEV = 'http://localhost:8090/blog/'

/* eslint-enable */
axios.defaults.baseURL = (process.env.NODE_ENV === 'production' ? API_ROOT : API_ROOT_DEV)

axios.defaults.headers.Accept = 'application/json'

// Add a request interceptor
/*axios.interceptors.request.use(function (config) {
  // debugger
  // if (config.baseURL.endsWith('blog/')) {
  //   return
  // }
  if (config.baseURL.indexOf('admin/') === 0) {
    if (getAccessToken()) {
      config.headers['accessToken'] = getAccessToken()
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})*/

// Add a response interceptor
/*axios.interceptors.response.use(function (response) {
  if (response.data.code !== 200) {
/!*    // 清空登录信息
    removeAccessToken()
    cachedAdminInfo.delete()
    // // 弹出提示信息
    // store.commit(SHOW_TOKEN_ERROR, true)
    // // 弹出登录窗口
    store.commit(IS_LOGIN, false)*!/
    let error = {
      msg: response.data.message
    }
    return Promise.reject(error)
  } else {
    return response.data
  }
}, function (error) {
  error = {
    msg: '请求出错'
  }
  return Promise.reject(error)
})*/
/*axios.interceptors.response.use(
  function (response) {
    // 检查响应的状态码
    if (response.data.code !== 200) {
      // 打印错误信息
      Message.error(response.data.message)
      // 返回一个拒绝的 Promise
      return Promise.reject(response.data.message)
    }
    // 返回成功的响应数据
    return response.data
  }
  // function (error) {
  //   // 打印请求错误信息
  //   console.error('请求错误:', error.message || '网络错误')
  //   return Promise.reject(new Error('请求出错'))
  // }
)*/

export default {
  /**
   * 管理员登录
   */
  adminLogin (params) {
    return axios.post('system/login', Qs.stringify(params))
  },
  /**
   * 获取七牛token
   */
  getQiniuToken () {
    return axios.get('back/getQiniuToken')
  },
  /**
   * 上传图片到七牛
   */
  uploadToQiniu (params) {
    return axios.post('back/uploadImage', params, {
      headers: {
        'content-type': 'multipart/form-data'
      },
      withCredentials: false
    })
  },
  /**
   * 获取博客配置
   */
  getBlogConfig () {
    return axios.get('a/webConfig')
  },
  /**
   * 修改博客配置
   */
  modifyBlogConfig (params) {
    return axios.post('a/webConfig/modify', Qs.stringify(params))
  },
  /**
   * 获取 关于我 页面
   */
  getAboutMe () {
    return axios.get('a/webConfig/getAbout')
  },
  /**
   * 修改 关于我 页面
   */
  modifyAboutMe (params) {
    return axios.post('a/webConfig/modifyAbout', Qs.stringify(params))
  },
  /**
   * 获取首页面板显示的统计信息
   */
  getHomeStatistics () {
    return axios.get('back/home')
  },
  /**
   * 获取系统日志
   */
  getSysLog (params) {
    return axios.get('back/log', {params: params})
  },
  /**
   * 添加分类
   */
  addCategory (categoryName) {
    return axios.post('a/category/add', Qs.stringify({categoryName: categoryName}))
  },
  /**
   * 添加标签
   */
  addTag (tag) {
    return axios.post('back/addTag', Qs.stringify({tag: tag}))
  },
  /**
   * 修改分类
   */
  modifyCategory (params) {
    return axios.post('a/category/modify', Qs.stringify(params))
  },
  /**
   * 修改标签
   */
  modifyTag (params) {
    return axios.post('a/tag/modify', Qs.stringify(params))
  },
  /**
   * 删除分类
   */
  deleteCategory (categoryId) {
    return axios.post('a/category/delete', Qs.stringify({categoryId: categoryId}))
  },
  /**
   * 删除标签
   */
  deleteTag (tagId) {
    return axios.post('a/tag/delete', Qs.stringify({tagId: tagId}))
  },
  /**
   * 获取分类列表
   */
  getCategoryList (params) {
    return axios.get('a/category/list', {
      params: params
    })
  },
  /**
   * 获取首页标签列表
   */
  getTagList () {
    return axios.get('article/listAllTags')
  },
  /**
   * 获取编辑标签列表
   */
  getEditTagList () {
    return axios.get('article/listEditTags')
  },
  /**
   * 获取分类
   */
  getCategory (categoryId) {
    return axios.get('a/category', {
      params: {
        categoryId: categoryId
      }
    })
  },
  /**
   * 获取标签
   */
  getTag (tagId) {
    return axios.get('a/tag', {
      params: {
        tagId: tagId
      }
    })
  },
  /**
   * 保存文章
   */
  saveArticle (params) {
    return axios.post('article/save', Qs.stringify(params))
  },
  /**
   * 更新文章发布
   */
  updateArticleStatus (params) {
    return axios.post('article/update-article-status', Qs.stringify(params))
  },
  /**
   * 发布文章
   */
  publishArticle (params) {
    return axios.post('back/publish', Qs.stringify(params))
  },
  /**
   * 编辑文章
   */
  modifyArticle (params) {
    return axios.post('back/editArticle', Qs.stringify(params))
  },
  /**
   * 删除文章
   */
  deleteArticle (articleId) {
    return axios.get('back/deleteArticle/' + articleId)
  },
  /**
   * 获取文章信息
   */
  getArticle (id) {
    return axios.get('article/get-article-by-id/' + id)
  },
  /**
   * 获取文章列表
   */
  getArticleList (params) {
    return axios.get('article/listArticles', {
      params: params
    })
  },
  /**
   * 获取友链列表
   */
  getFriendsList (params) {
    return axios.get('a/friends/list', {
      params: params
    })
  },
  /**
   * 添加友链
   */
  addFriend (params) {
    return axios.post('a/friends/add', Qs.stringify(params))
  },
  /**
   * 编辑友链
   */
  modifyFriend (params) {
    return axios.post('a/friends/modify', Qs.stringify(params))
  },
  /**
   * 删除友链
   */
  deleteFriend (friendId) {
    return axios.post('a/friends/delete', Qs.stringify({friendId: friendId}))
  },
  /**
   * 获取友链类型列表
   */
  getFriendTypeList () {
    return axios.get('a/friends/typeList')
  },
  /**
   * 获取所有评论列表
   */
  getAllCommentsList (params) {
    return axios.get('a/comments/alllist', {
      params: params
    })
  },
  /**
   * 获取文章评论列表
   */
  getComments (articleId) {
    return axios.get('a/comments/list', {
      params: {
        articleId: articleId
      }
    })
  },
  /**
   * 添加评论
   */
  adminReplyComments (params) {
    return axios.post('a/comments/add', Qs.stringify(params))
  },
  /**
   * 删除评论
   */
  deleteComments (id) {
    return axios.post('a/comments/delete', Qs.stringify({commentsId: id}))
  },
  /**
   * 获取 我的简历 页面
   */
  getResume () {
    return axios.get('a/webConfig/getResume')
  },
  /**
   * 修改 我的简历 页面
   */
  modifyResume (params) {
    return axios.post('a/webConfig/modifyResume', Qs.stringify(params))
  },
  // ---------------------------------------------以下是博客页面使用的接口---------------------------------------------,
  /**
   * 获取 关于我 页面
   */
  getBlogAboutMe () {
    return axios.get('w/getAbout')
  },
  /**
   * 获取博客信息
   */
  getBlogInfo () {
    return axios.get('blogInfo/about')
  },
  /**
   * 获取文章主页列表
   */
  getBlogArticleList (params) {
    return axios.get('article/page-home-article', {
      params: params
    })
  },

  /**
   * 获取所有文章列表
   */
  getAllArticleList (params) {
    return axios.get('article/page-all-article', {
      params: params
    })
  },

  // 后台
  getBackList (params) {
    return axios.get('back/listArticles', {
      params: params
    })
  },
  /**
   * 获取文章归档列表
   */
  getBlogArticleArchives (params) {
    return axios.get('w/article/archives', {
      params: params
    })
  },
  /**
   * 获取文章信息
   */
  getBlogArticle (articleId) {
    return axios.get('article/getArticleDetailById/' + articleId)
  },
  /**
   * 获取分类列表
   */
  getBlogCategoryList () {
    return axios.get('w/category/list')
  },
  /**
   * 获取标签列表
   */
  listTags () {
    return axios.get('article/listTags')
  },
  /**
   * 获取友链列表
   */
  getBlogFriendsList () {
    return axios.get('w/friends/list')
  },
  /**
   * 获取文章评论列表
   */
  getBlogComments (articleId) {
    return axios.get('comments/listCommentsByArticleId/' + articleId)
  },
  /**
   * 添加评论
   */
  replyComments (params) {
    return axios.post('comments/addComments', Qs.stringify(params))
  },
  /**
   * 获取 我的简历 页面
   */
  getBlogResume () {
    return axios.get('w/getResume')
  },
  /**
   * 按文章标题和简介搜索
   */
  searchArticle (params) {
    return axios.get('article/listSearch', {
      params: params
    })
  },
  /**
   * 按文章标题和简介搜索
   */
  tagArticles (params) {
    return axios.get('article/tagArticles', {
      params: params
    })
  },
  /**
   * 获取后台菜单
   */
  getMenus (userId) {
    return axios.get('system/getMenus/' + userId)
  },

  uploadExcel (params) {
    return axios.post('task/createTask', params)
  },
  listTask (params) {
    return axios.get('task/listTask', {
      params: params
    })
  },
  listAddress (params) {
    return axios.get('address/listAddress', {
      params: params
    })
  },
  deleteTask (taskId) {
    return axios.get('task/deleteTask/' + taskId)
  },

  listModule (params) {
    return axios.get('module/listModule', {
      params: params
    })
  },
  deleteModule (id) {
    return axios.get('module/deleteModule/' + id)
  },
  uploadScore (params) {
    return axios.post('score-manage/upload-score', params)
  },
  pageScore (params) {
    return axios.get('score-manage/page-score', {
      params: params
    })
  },
  listLesson () {
    return axios.get('score-manage/list-lesson')
  },
  deleteScore (params) {
    return axios.get('score-manage/delete', {
      params: params
    })
  },
  pageTask (params) {
    return axios.get('task/page-task', {
      params: params
    })
  },
  /**
   * 获取所有文章列表
   */
  getAllUserList (params) {
    return axios.get('system/page-all-user', {
      params: params
    })
  },

  listAllRole () {
    return axios.get('system/list-all-role')
  },

  /**
   * 注册
   */
  registerUser (params) {
    return axios.post('system/register', Qs.stringify(params))
  },
  /**
   * 删除用户
   */
  deleteUser (id) {
    return axios.get('system/delete-user/' + id)
  },

  listAllMenu () {
    return axios.get('system/list-all-menu')
  },

  /**
   * 获取后台菜单
   */
  getMenusByRoleId (roleId) {
    return axios.get('system/menu-tree/' + roleId)
  },

  /**
   * 保存角色权限
   */
  savePermissions (params) {
    return axios.post('system/save-permissions', Qs.stringify(params))
  },

  /**
   * 退出
   */
  logout () {
    return axios.get('system/logout')
  },

  /**
   * 删除角色
   */
  deleteRole (id) {
    return axios.get('system/delete-role/' + id)
  },


}
