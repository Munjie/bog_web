<template>
  <div id="login">
    <div class="login-wrap">
      <h1 class="login-title">BS</h1>
      <div class="login-form-wrap">
        <el-form :model="loginForm"
                :rules="loginRules"
                ref="loginForm">
          <el-form-item prop="username">
            <el-input type="text"
                      :maxlength="11"
                      placeholder="请输入用户名"
                      v-model="loginForm.userName">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password"
                      :maxlength="16"
                      placeholder="请输入密码"
                      v-model="loginForm.password">
          </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                      @click="submitForm"
                      :class="{'disabled': btnDisabled}">
                      立即登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapActions,
  mapGetters
} from 'vuex'

export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [
          { required: true, message: '未填写密码', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '未填写密码', trigger: 'blur' },
          { min: 2, message: '密码不能少于6位', trigger: 'blur' }
        ]
      },
      message: ''
    }
  },
  computed: {
    ...mapGetters([
      'adminInfo'
    ]),
    btnDisabled () {
      return this.loginForm.userName === '' ||
            this.loginForm.password === '' ||
            this.loginForm.password.length < 6
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyDown)
    if (this.adminInfo) {
      this.loginForm.userName = this.adminInfo.userName
    }
  },
  methods: {
    ...mapActions([
      'adminLogin'
    ]),
    submitForm () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          let loginFormParams = {
            userName: this.loginForm.userName,
            password: this.loginForm.password
          }
          this.adminLogin(loginFormParams).then((data) => {
            debugger
            if (data.code === 200) {
              // 跳转到原页面，否则跳到首页
              const redirect = this.$route.query.redirect
              if (redirect) {
                this.$router.push(redirect)
              } else {
                this.$router.push('/admin')
              }
            }else {
              this.$toast(data)
            }
            })
            .catch((err) => {
              // this.$toast(err, 'error')
            })
        } else {
          return false
        }
      })
    },
    keyDown (e) {
      // 回车则执行登录方法，enter键的ASCII是13
      if (e.keyCode === 13) {
        this.submitForm()
      }
    }
  },
  // 销毁事件
  destroyed () {
    window.removeEventListener('keydown', this.keyDown, false)
  }
}
</script>
<style lang="stylus" scoped>
@import '~STYLUS/color.styl'
#login
  position: fixed
  top: 0
  left: 0
  bottom: 0
  right: 0
  z-index: 2000
  background-color: $color-white
  background-position: center
  background-size: cover
 // background-image: url()
  .login-wrap
    position: relative
    background-color: $color-white
    padding: 20px
    border-radius: 10px
    max-width: 460px
    margin: 20px auto
    line-height: 1
    top: 50%
    transform: translateY(-50%)
    .login-title
      font-size: 36px
      color: $color-main
      text-align: center
      margin-top: 20px
      margin-bottom: 30px
      @media (max-width: 759px)
        font-size: 20px
    .login-form-wrap
      margin: 0px auto
    .el-button
      width: 100%
      height: 40px
      font-size: 16px
      border-radius: 5px
      border: none
      background-color: $color-main
      transition: all .3s
      color: $color-white
      &:hover
        background-color: lighten($color-main, 20%)
      &.disabled
        border: none
        background-color: #e5e5e5
        &:hover
          background-color: #e5e5e5
</style>
