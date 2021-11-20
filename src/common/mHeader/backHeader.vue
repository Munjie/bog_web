<template>
  <div class="header-wrapper">
    <div class="header-left">

    </div>
    <div class="header-right">
      <span class="header-user"><i class="el-icon-user"></i>{{userName}}</span>
<!--      <el-dropdown  trigger="click">
				<span class="el-dropdown-line">
					<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
				</span>
        &lt;!&ndash;        <el-dropdown-menu slot="dropdown">
                  <el-dropdown-menu icon="el-icon-plus>修改密码</el-dropdown-menu>
                  <el-dropdown-menu icon="el-icon-circle-plus" @click.native="handleLogout">退出登录</el-dropdown-menu>
                </el-dropdown-menu>&ndash;&gt;
        <el-dropdown-menu slot="dropdown">

        </el-dropdown-menu>

      </el-dropdown>-->
      <el-dropdown @command="handleCommand">
				<span class="el-dropdown-line">
					<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
				</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command = 'set'><i class="el-icon-setting"></i>设置</el-dropdown-item>
          <el-dropdown-item command = 'exit'><i class="el-icon-switch-button"></i>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>


<script>
import {mapActions, mapGetters, mapState} from 'vuex'

export default{
  name:'back-header',
  data(){
    return{
      userName:''
    }
  },
  watch:{

  },
  computed: {
    ...mapGetters([
      'screen',
      'adminInfo'
    ]),
  },
  mounted(){
    if (this.adminInfo) {
      this.userName = this.adminInfo.userName
    }

  },
  methods:{
    ...mapActions([
      'adminSignOut'
    ]),

    signOut () {
      debugger
      this.$confirm('是否退出', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.adminSignOut()
        this.$router.push('/admin')
      }).catch(()=>{})
    },
    handleCommand(command) {
      if (command === 'exit') {
        this.signOut()
      }else {
        this.$message('待开发...');
      }
    }

  }
}
</script>

<style lang="stylus" scope>
.header-wrapper{
  display:flex;
  justify-content:space-between;
  align-content:center;
  padding:0 15px;
  height:60px;
  background-color #409eff
  .header-left{
    display:flex;
    align-items:center;
    .open-icon{
      font-size:20px;
      margin-right:15px;
      cursor:pointer;
    }
  }
  .header-right{
    display:flex;
    align-items:center;
    .header-user{
      margin-right:15px;
    }
  }
}
.el-dropdown-link{
  cursor:pointer;
  color:#409eff;
  img{
    width:40px;
    height:40px;
    border-radius:5px;
  }
}
.el-icon-arrow-down{
  font-size:12px;
}
.demostration{
  display:block;
  color:#8492a6;
  font-size:14px;
  margin-bottom:20px;
}
</style>
