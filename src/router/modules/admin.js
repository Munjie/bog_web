const adminHome = r => require.ensure([], () => r(require('VIEWS/admin/adminHome/index.vue')), 'adminHome')
const editArticle = r => require.ensure([], () => r(require('VIEWS/admin/article/editArticle.vue')), 'editArticle')
const articleManage = r => require.ensure([], () => r(require('VIEWS/admin/article/articleManage.vue')), 'articleManage')
const articleDeleted = r => require.ensure([], () => r(require('VIEWS/admin/article/articleDeleted.vue')), 'articleDeleted')
const articleDrafts = r => require.ensure([], () => r(require('VIEWS/admin/article/articleDrafts.vue')), 'articleDrafts')
const articlePreview = r => require.ensure([], () => r(require('VIEWS/admin/article/articlePreview.vue')), 'articlePreview')
const adminCategories = r => require.ensure([], () => r(require('VIEWS/admin/categories/index.vue')), 'adminCategories')
const webConfig = r => require.ensure([], () => r(require('VIEWS/admin/webConfig/index.vue')), 'webConfig')
const webConfigAbout = r => require.ensure([], () => r(require('VIEWS/admin/webConfig/about.vue')), 'webConfigAbout')
const webConfigFriends = r => require.ensure([], () => r(require('VIEWS/admin/webConfig/friends.vue')), 'webConfigFriends')
const adminArticleList = r => require.ensure([], () => r(require('VIEWS/admin/categories/articleList.vue')), 'adminArticleList')
const adminComments = r => require.ensure([], () => r(require('VIEWS/admin/comments/index.vue')), 'adminComments')
const webConfigResume = r => require.ensure([], () => r(require('VIEWS/admin/webConfig/resume.vue')), 'webConfigResume')
const excel = r => require.ensure([], () => r(require('VIEWS/admin/leftMenu/excel.vue')), 'excel')
const taskList = r => require.ensure([], () => r(require('VIEWS/admin/leftMenu/taskList.vue')), 'taskList')
const addressList = r => require.ensure([], () => r(require('VIEWS/admin/leftMenu/addressList.vue')), 'addressList')
const moduleList = r => require.ensure([], () => r(require('VIEWS/admin/system/moduleList.vue')), 'moduleList')
const excelView = r => require.ensure([], () => r(require('VIEWS/admin/scoreManage/excelView.vue')), 'excelView')
const uploadScore = r => require.ensure([], () => r(require('VIEWS/admin/scoreManage/uploadScore.vue')), 'uploadScore')
const userList = r => require.ensure([], () => r(require('VIEWS/admin/system/userList.vue')), 'userList')
const login = r => require.ensure([], () => r(require('VIEWS/admin/auth/login.vue')), 'login')

const menuList = r => require.ensure([], () => r(require('VIEWS/admin/system/menuList.vue')), 'menuList')
const roleManage = r => require.ensure([], () => r(require('VIEWS/admin/system/roleManage.vue')), 'roleManage')

export default [
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      requireAuth: false
    }
  },
  {
    path: '/admin',
    name: 'adminHome',
    component: adminHome,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/article/publish',
    name: 'publishArticle',
    component: editArticle,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/article/edit',
    name: 'editArticle',
    component: editArticle,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/article/manage',
    name: 'articleManage',
    component: articleManage,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/article/deleted',
    name: 'articleDeleted',
    component: articleDeleted,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/article/drafts',
    name: 'articleDrafts',
    component: articleDrafts,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/article/preview',
    name: 'articlePreview',
    component: articlePreview,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/categories',
    name: 'adminCategories',
    component: adminCategories,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/comments',
    name: 'adminComments',
    component: adminComments,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/webConfig',
    name: 'webConfig',
    component: webConfig,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/webConfig/about',
    name: 'webConfigAbout',
    component: webConfigAbout,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/webConfig/friends',
    name: 'webConfigFriends',
    component: webConfigFriends,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/articlelist',
    name: 'adminArticleList',
    component: adminArticleList,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/webConfig/resume',
    name: 'webConfigResume',
    component: webConfigResume,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/leftMenu/excel',
    name: 'excel',
    component: excel,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/leftMenu/taskList',
    name: 'taskList',
    component: taskList,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/leftMenu/addressList',
    name: 'addressList',
    component: addressList,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/system/moduleList',
    name: 'moduleList',
    component: moduleList,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/scoreManage/excelView',
    name: 'excelView',
    component: excelView,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/scoreManage/uploadScore',
    name: 'uploadScore',
    component: uploadScore,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/system/userList',
    name: 'userList',
    component: userList,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/system/menuList',
    name: 'menuList',
    component: menuList,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/admin/system/roleManage',
    name: 'roleManage',
    component: roleManage,
    meta: {
      requireAuth: true
    }
  },
]
