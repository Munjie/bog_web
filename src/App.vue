<template>
  <div id="appindex">
<!--    <vue-particles
      id="particles-js"
      color="#005757"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="star"
      :particleSize="2"
      linesColor="#ffd25f"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>-->
    <!-- 博客页面 -->
    <div class="content-wrap" v-if="!isAdminWrap">
      <!-- header -->
      <m-header />
      <!-- header 结束 -->
      <!-- content -->
      <div class="view-wrap" :style="{width: viewWrapWidth}">
        <router-view></router-view>
      </div>
      <!-- content 结束 -->
      <!-- footer -->
      <m-footer />
      <!-- footer 结束 -->
    </div>
    <right-nav v-if="!isAdminWrap" />
    <!-- 博客页面 结束 -->

    <!-- 博客后台管理页面 -->
    <div class="admin-wrap" v-if="isAdminWrap">
      <leftMenu />
      <!-- content -->
      <div class="view-wrap">
        <back-header />
        <router-view></router-view>
      </div>
      <!-- content 结束 -->
    </div>
    <!-- 博客后台管理页面 结束 -->

    <!-- 返回顶部 -->
    <transition name="slide-fade">
      <div class="to-top" @click="scrollToTarget(0)" v-show="showScrollToTop">
        <span
          class="to-top-line"
          v-for="(line, index) in lineData"
          :key="index"
          :style="{
            height: line.height,
            left: line.left,
            transform: line.transform
          }">
        </span>
      </div>
    </transition>
    <!-- 返回顶部 结束 -->
    <!-- 登录 -->
    <transition name="fade">
      <login-layout v-if="!isLogin&&isAdminWrap"></login-layout>
    </transition>
    <!-- 登录 结束 -->
  </div>
</template>
<script>
import {
  SCREEN_CHANGE,
  SHOW_TOKEN_ERROR
} from 'STORE/mutation-types'

import {
  mapActions,
  mapGetters,
  mapMutations
} from 'vuex'

import { scroll } from 'MIXINS/scroll'

import mHeader from 'COMMON/mHeader/mHeader'
import backHeader from 'COMMON/mHeader/backHeader'
import mFooter from 'COMMON/mFooter/mFooter'
import rightNav from 'COMMON/rightNav/rightNav'
import loginLayout from 'VIEWS/admin/auth/login'
import leftMenu from 'VIEWS/admin/leftMenu/leftMenu'
import {L2Dwidget} from 'live2d-widget'

export default {
  name: 'app',
  components: {
    mHeader,
    backHeader,
    rightNav,
    mFooter,
    loginLayout,
    leftMenu
  },
  mixins: [scroll],
  data () {
    return {
      lineData: [
        {
          height: '50%',
          left: '3px',
          transform: 'rotateZ(45deg)'
        },
        {
          height: '100%',
          top: '0px',
          transform: 'rotateZ(0deg)'
        },
        {
          height: '50%',
          left: '-3px',
          transform: 'rotateZ(-45deg)'
        }
      ],
      showScrollToTop: false,
      evtname: '',
      viewWrapWidth: '1000px',
      // model: 'miku',
      // model: 'koharu',
      // model: 'hibiki',
      // model: 'haru_2',
      model: 'haru_1',
    }
  },
  watch: {
    tokenError (value) {
      if (value) {
        this.$store.commit(SHOW_TOKEN_ERROR, false)
        this.message = this.$message({
          showClose: true,
          message: '账号过期，请重新登录',
          type: 'error'
        })
      }
    },
    showRightNav (value) {
      this.setViewWrapWidth()
    },
    screen (value) {
      this.setViewWrapWidth()
    }
  },
  computed: {
    ...mapGetters([
      'isAdminWrap',
      'isLogin',
      'tokenError',
      'articleMenu',
      'articleMenuSource',
      'blogInfo',
      'showRightNav',
      'screen'
    ])
  },
  created() {
    const head = document.getElementsByTagName('head')[0];
    // 定义DOM树变化后的回调
    const callBack = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes[0] && mutation.addedNodes[0].tagName === "SCRIPT") {
          const url = mutation.addedNodes[0].src;
          console.log(url);
          if (url) {
            let xhr = new XMLHttpRequest();
            xhr.open('get', url);
            xhr.onload = () => {
              const text = xhr.responseText;
              // console.log(text);
              if (text.indexOf('<') === 0) {
                this.$confirm("检测到新版本已发布，刷新后加载最新内容!",'提示', {
                  confirmButtonText: '刷新',
                  type: 'error',
                  closeOnClickModal: false,
                  closeOnPressEscape:false,
                  closeOnHashChange:false,
                  showCancelButton: false,
                  showClose: false
                }).then(res => {
                  window.location.reload(true);
                })
                return false;
              }
            }
            xhr.send();
          }
        }
      }
    }
    // 配置项
    const config = {attributes: false, childList: true, subtree: false};
    // observer观察器
    const observer = new MutationObserver(callBack);
    // 开始观察
    observer.observe(head, config);
    // 停止观察
    // observer.disconnect();
    if (!this.isAdminWrap) {
   //   this.getBlogInfo().catch(()=> {})
    }
    // setTimeout(() => {
    //   window.L2Dwidget.init({
    //     pluginRootPath: 'static/live2dw/',
    //     pluginJsPath: 'lib/',
    //
    //     pluginModelPath: 'live2d-widget-model-haru_2/assets/',
    //     tagMode: false,
    //     debug: false,
    //     model: { jsonPath: 'static/live2dw/live2d-widget-model-haru_2/assets/haru02.model.json' },
    //     display: { position: 'right', width: 150, height: 300 },
    //     mobile: { show: true },
    //     log: false
    //   })
    // }, 1000)
/*    setTimeout(function () {
      L2Dwidget.init({
        model: {
          jsonPath: 'https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json',
        },
        "display": {
          "position": "right",
          "width": 100,
          "height": 200,
          "hOffset": 0,
          "vOffset": -20
        },
        "mobile": {
          "show": true,
          "scale": 0.5
        },
        "react": {
          "opacityDefault": 0.7,
          "opacityOnHover": 0.2
        },
        "dialog": {
          "enable": true,
          "script": {
            'tap body': '哎呀！别碰我！',
            'tap face': '好害羞',
          }
        }

      });
    },1000);*/
  },
  mounted() {
    document.title = `Munjie`;
    this.updateScreen()
    window.addEventListener('resize', this.updateScreen)
    window.addEventListener('scroll', this.scrollListener)
    let visProp = this.getHiddenProp()
    this.evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange'
    document.addEventListener(this.evtname, this.visibilityChange, false)
    // this.$nextTick(() => {
    //   this.live2dInit()
    // })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.updateScreen, false)
    window.removeEventListener('scroll', this.scrollListener, false)
    document.removeEventListener(this.evtname, this.visibilityChange, false)
  },
  methods: {
    ...mapActions([
      'setShowRightNav',
      'getBlogInfo',
      'setArticleMenuTag'
    ]),
    live2dInit() {
        L2Dwidget.init({
        pluginRootPath: 'static/live2dw/',
        pluginJsPath: 'lib/',
        pluginModelPath: `live2d-widget-model-${this.model}/assets/`,
        tagMode: false,
        debug: false,
        model: {
          jsonPath: `/static/live2dw/live2d-widget-model-${this.model}/assets/${this.model}.model.json`,
        },
        display: { position: 'right', width: 150, height: 300 },
        mobile: { show: true },
        log: false,
      })
    },
    setViewWrapWidth () {
      let temp = 20
      if (this.screen.width > 990 && this.showRightNav) {
        temp = 340
      }
      this.viewWrapWidth = this.screen.width - temp + 'px'
    },
    updateScreen () {
      this.$store.commit(SCREEN_CHANGE, {
        width: window.innerWidth,
        height: window.innerHeight
      })
    },
    scrollListener () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop >= 60) {
        this.showScrollToTop = true
      } else {
        this.showScrollToTop = false
      }
      if (this.articleMenu) {
        for (let i = 0, len = this.articleMenuSource.length; i < len; ++i) {
          let item = this.articleMenuSource[i]
          let top = document.getElementById(item.id).getBoundingClientRect().top
          top += document.body.scrollTop || document.documentElement.scrollTop
          if (scrollTop <= top + 20) {
            this.setArticleMenuTag(item.tag)
            break
          }
        }
      }
    },
    getHiddenProp () {
      var prefixes = ['webkit', 'moz', 'ms', 'o']
      // if 'hidden' is natively supported just return it
      if ('hidden' in document) {
        return 'hidden'
      }
      // otherwise loop over all the known prefixes until we find one
      for (var i = 0; i < prefixes.length; i++) {
        if ((prefixes[i] + 'Hidden') in document) {
          return prefixes[i] + 'Hidden'
        }
      }
      // otherwise it's not supported
      return null
    },
    getVisibilityState () {
      var prefixes = ['webkit', 'moz', 'ms', 'o']
      if ('visibilityState' in document) return 'visibilityState'
      for (var i = 0; i < prefixes.length; i++) {
        if ((prefixes[i] + 'VisibilityState') in document) {
          return prefixes[i] + 'VisibilityState'
        }
      }
      // otherwise it's not supported
      return null
    },
    visibilityChange () {
      switch (document[this.getVisibilityState()]) {
        case 'visible':
          document.title = `Munjie`;
          break
        case 'hidden':
        default:
          document.title = `Munjie`;
          break
      }
    }
  }
}
</script>

<style lang="stylus" src="STYLUS/main.styl"></style>

<style lang="stylus">
@import '~STYLUS/color.styl'
#particles-js{
  width: 100%;
  height: calc(100% - 100px);
  position: absolute;   //设置absolute,其他DIV设置为relative，这样这个例子效果就作为背景
  //background-image: url(./assets/images/your.jpg);
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  margin-left: auto;
  margin-right: auto;
}
#appindex
  width: 100%
  min-height: 100%
  min-width: 320px
  display: flex
  flex-direction: row
  position: absolute
  .admin-wrap
    width: 100%
    position: relative
    display: flex
    flex-direction: row
    .view-wrap
      flex: 1
      min-width: 311px
      height: calc(100vh)
  .content-wrap
    flex: 1
    position: relative
    .view-wrap
      max-width: 1000px
      min-width: 320px
      margin: 0 auto
      padding: 0 10px
      min-height: calc(100vh - 120px)
      transition: width .3s
  .to-top
    position: fixed
    width: 24px
    height: 24px
    background-color: $color-main
    right: 10px
    bottom: 15px
    padding: 5px
    z-index: 1050
    cursor: pointer
    line-height: 0
    display: flex
    flex-direction: row
    align-items: flex-start
    .to-top-line
      position: relative
      width: 2px
      height: 100%
      margin-left: 4px
      background-color: $color-white
      &:first-child
        margin-left: 0px

.slide-fade-enter-active
  transition: all .3s ease
.slide-fade-leave-active
  transition: all .3s ease
.slide-fade-enter
.slide-fade-leave-to
  transform: translateY(20px)
  opacity: 0

.fade-enter-active, .fade-leave-active
  transition: opacity .3s
.fade-enter, .fade-leave-to
  opacity: 0
</style>
