<template>
  <div class="menu-item">
    <template v-for="list in this.menuList">
      <el-submenu v-if="list.children && list.children.length>0" :key="list.id" :index="list.url">
        <template slot="title"  style="padding-left:10px" class="submenu-title">
          <i :class="list.icon"></i>
          <span slot="title">{{ list.name}}</span>
        </template>
        <el-menu-item-group>
          <span slot="title" v-show="setSidebar">{{ list.name}}</span>
          <Menu :menuList="list.children"></Menu>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item v-else :index="list.url" :key="list.id">
        <!--        <template slot="title">-->
        <i :class="list.icon"></i>
        <span slot="title">{{list.name}}</span>
        <!--        </template>-->
      </el-menu-item>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default{
  name:'Menu',//模板名称
  data(){
    return {
    }
  },
  beforeMount(){
  },
  computed: {
    ...mapState(['setSidebar'])
  },
  created() {
    console.log('9999999'+this.setSidebar);
  },
  props:['menuList']
}
</script>

<style lang="stylus" scoped>
@import '~STYLUS/color.styl'
#left-menu
  position: relative
  height: 100%
  width: 64px
  z-index: 1100
  transition: width .5s
  .wrap
    position: fixed
    height: 100%
    .menu
      position: relative
      height: 100%
      font-weight: bold
      padding-bottom: 30px
      &:not(.el-menu--collapse)
        width: 240px
    .collapse-wrap
      position: absolute
      width: 24px
      height: 24px
      background-color: $color-main
      right: 20px
      bottom: 15px
      padding: 5px
      z-index: 1050
      cursor: pointer
      line-height: 0
      .collapse-line
        position: relative
        display: inline-block
        vertical-align: top
        width: 100%
        height: 2px
        margin-top: 4px
        background-color: $color-white
        transition: all .3s
        &:first-child
          margin-top: 0px
</style>

<style lang="stylus">
.el-menu-item
.el-submenu__title
  font-size: 14px !important
  &.is-active
    background-color: rgb(30, 34, 38) !important
  .iconfont
    margin-right: 10px !important
    font-size: 14px !important
</style>
