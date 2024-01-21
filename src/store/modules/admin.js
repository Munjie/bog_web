import api from 'API/index'
import {
  IS_LOGIN,
  SET_ADMIN_INFO,
  SHOW_TOKEN_ERROR
} from '../mutation-types'

import {
  getAccessToken,
  cachedAdminInfo,
  removeAccessToken,
  saveAccessToken
} from '../../api/cacheService'
const state = {
  isLogin: getAccessToken() ? true : false, // eslint-disable-line
  tokenError: false,
  adminInfo: cachedAdminInfo.load() || {}
}

const getters = {
  isLogin (state) {
    return state.isLogin
  },
  tokenError (state) {
    return state.tokenError
  },
  adminInfo (state) {
    return state.adminInfo
  }
}

const mutations = {
  [IS_LOGIN] (state, data) {
    state.isLogin = data
  },
  [SHOW_TOKEN_ERROR] (state, data) {
    state.tokenError = data
  },
  [SET_ADMIN_INFO] (state, data) {
    state.adminInfo = data
  }
}

const actions = {
  setIsLogin (store, isLogin) {
    store.state.isLogin = isLogin
  },
  /**
   * 管理员登录
   */
  adminLogin (store, params) {
    debugger
    return api.adminLogin(params)
      .then((data) => {
        debugger
        saveAccessToken(data.data.token, data.data.expTime)
        cachedAdminInfo.save(data.data.user)
        store.commit(SET_ADMIN_INFO, data.data.user)
        store.commit(IS_LOGIN, true)
        return Promise.resolve(data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 退出登录
   */
  adminSignOut (store) {
    removeAccessToken()
    cachedAdminInfo.delete()
    store.commit(IS_LOGIN, false)
    store.commit(SET_ADMIN_INFO, {})
  },
  /**
   * 获取七牛token
   */
  getQiniuToken () {
    return api.getQiniuToken()
      .then((data) => {
        return Promise.resolve(data.message)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取博客配置
   */
  getBlogConfig (store) {
    return api.getBlogConfig()
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 修改博客配置
   */
  modifyBlogConfig (store, params) {
    return api.modifyBlogConfig(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取 关于我 页面
   */
  getAboutMe (store) {
    return api.getAboutMe()
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 修改 关于我 页面
   */
  modifyAboutMe (store, params) {
    return api.modifyAboutMe(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取首页面板显示的统计信息
   */
  getHomeStatistics (store) {
    return api.getHomeStatistics()
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取系统日志
   */
  getSysLog (store, params) {
    return api.getSysLog(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 添加分类
   */
  addCategory (store, categoryName) {
    return api.addCategory(categoryName)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 添加标签
   */
  addTag (store, tagName) {
    return api.addTag(tagName)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 修改分类
   */
  modifyCategory (store, params) {
    return api.modifyCategory(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 修改标签
   */
  modifyTag (store, params) {
    return api.modifyTag(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 删除分类
   */
  deleteCategory (store, categoryId) {
    return api.deleteCategory(categoryId)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 删除标签
   */
  deleteTag (store, tagId) {
    return api.deleteTag(tagId)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取分类列表
   */
  getCategoryList (store, params) {
    return api.getCategoryList(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取首页标签列表
   */
  getTagList () {
    return api.getTagList()
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取编辑标签列表
   */
  getEditTagList () {
    return api.getEditTagList()
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取分类
   */
  getCategory (store, categoryId) {
    return api.getCategory(categoryId)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取标签
   */
  getTag (store, tagId) {
    return api.getTag(tagId)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 保存文章
   */
  saveArticle (store, params) {
    return api.saveArticle(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 发布文章
   */
  publishArticle (store, params) {
    return api.publishArticle(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 编辑文章
   */
  modifyArticle (store, params) {
    return api.modifyArticle(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 删除文章
   */
  deleteArticle (store, articleId) {
    return api.deleteArticle(articleId)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取文章信息
   */
  getArticle (store, articleId) {
    return api.getArticle(articleId)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取文章列表
   */
  getBackList (store, params) {
    return api.getBackList(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取友链列表
   */
  getFriendsList (store, params) {
    return api.getFriendsList(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 添加友链
   */
  addFriend (store, params) {
    return api.addFriend(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 编辑友链
   */
  modifyFriend (store, params) {
    return api.modifyFriend(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 删除友链
   */
  deleteFriend (store, friendId) {
    return api.deleteFriend(friendId)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取友链类型列表
   */
  getFriendTypeList (store) {
    return api.getFriendTypeList()
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取所有评论列表
   */
  getAllCommentsList (store, params) {
    return api.getAllCommentsList(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取文章评论列表
   */
  getComments (store, articleId) {
    return api.getComments(articleId)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 添加评论
   */
  adminReplyComments (store, params) {
    return api.adminReplyComments(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 删除评论
   */
  deleteComments (store, commentsId) {
    return api.deleteComments(commentsId)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取 我的简历 页面
   */
  getResume (store) {
    return api.getResume()
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 修改 我的简历 页面
   */
  modifyResume (store, params) {
    return api.modifyResume(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },

  tagArticles (store, params) {
    return api.tagArticles(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  getMenus (store, params) {
    return api.getMenus(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  uploadExcel (store, params) {
    return api.uploadExcel(params)
      .then((data) => {
        return Promise.resolve(data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 获取文章列表
   */
  listTask (store, params) {
    return api.listTask(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  listAddress (store, params) {
    return api.listAddress(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  deleteTask (store, taskId) {
    return api.deleteTask(taskId)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 后台模块
   */
  listModule (store, params) {
    return api.listModule(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  /**
   * 删除模块
   * @param store
   * @param id
   * @returns {Promise<unknown>}
   */
  deleteModule (store, id) {
    return api.deleteModule(id)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },

  uploadScore (store, params) {
    return api.uploadScore(params)
      .then((data) => {
        return Promise.resolve(data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  pageScore (store, params) {
    return api.pageScore(params)
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  listLesson (store) {
    return api.listLesson()
      .then((data) => {
        return Promise.resolve(data.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}
