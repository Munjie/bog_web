<template>
  <div id="m-footer">
    <div class="footer-wrap">
      <p>
         Copyright @ 2020-2025 <a href="https://beian.miit.gov.cn" target="_blank"> 沪ICP备19003704号</a>
      </p>
    </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'm-footer',
  components: {
  },
  data () {
    return {
      runningTime: 0
    }
  },
  computed: {
    ...mapGetters([
      'blogInfo'
    ])
  },
  created () {
    this.running()
  },
  methods: {
    running() {
      let startTime = new Date('2018/08/01 00:00:00')
      let timer = setInterval(() => {
        let time = new Date() - startTime
        let day = parseInt(time / 1000 / 60 / 60 / 24 , 10)
        let hour = parseInt(time / 1000 / 60 / 60 % 24 , 10)
        let minute = parseInt(time / 1000 / 60 % 60,  10)
        let second = parseInt(time / 1000 % 60,  10)
        this.runningTime = `${day}天${hour}小时${minute}分${second}秒`
      }, 1000)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~STYLUS/color.styl'
#m-footer
  position: relative
  height: 120px
  width: 100%
  background-color: $color-main
  .footer-wrap
    position: relative
    max-width: 1000px
    padding: 0 20px
    margin: 0 auto
    height: 120px
    font-size: 13px
    @media (max-width: 768px)
      font-size: 12px
    display: flex
    flex-direction: column
    justify-content: center
    color: #999999
    > p
      margin: 4px 0
      text-align center
      a
        color: rgba(59, 116, 241, .8)
        text-decoration: underline
</style>
