<template>
  <div id="article-manage">
    <div class="article-table-wrap">
      <div class="button-container">
      <el-button type="primary" icon="el-icon-edit" @click="addUser()">新增用户</el-button>
      </div>
      <el-table
        :data="userList"
        border
        stripe
        size="mini"
        style="width: 100%">
        <el-table-column
          prop="userName"
          label="用户名"
          show-overflow-tooltip
          align="center">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              circle
              @click="edit(scope.row.id)">
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteUser(scope.row.id)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div
        class="pagination"
        v-show="userList.length > 0">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          @current-change="pageChange"
          :current-page="currentPage"
          :total="total">
        </el-pagination>
      </div>
      <!-- 分页 结束 -->
    </div>
  </div>
</template>

<script>
  import {
    mapActions,
    mapGetters
  } from 'vuex'

  import moment from 'moment'
  import { scroll } from 'MIXINS/scroll'

  export default {
    name: 'userList',
    components: {
    },
    mixins: [scroll],
    data () {
      return {
        userList: [],
        page: 0,
        pageSize: 15,
        currentPage: 0,
        total: 0
      }
    },
    created() {
      this.page = 0
      this.getList()
    },
    methods: {
      ...mapActions([
        'getAllUserList',
        'deleteUser',
      ]),
      edit(articleId) {
        console.log(articleId)
        this.$router.push({
          name: 'editUser',
          query: {
            id: articleId
          }
        })
      },
      addUser() {
        this.$router.push({
          name: 'userAdd',
        })
      },
      deleteUser(id) {
        console.log(id)
        this.showDialog('此操作会将用户删除，不再显示, 是否继续?', ()=> {
          this.deleteUser(id)
            .then((data) => {
              this.$toast('已删除')
              this.page = 0
              this.getList()
            })
            .catch((err)=> {
              this.$toast(err.msg, 'error')
            })
        })
      },
      pageChange(currentPage) {
        this.scrollToTarget(0, false)
        this.page = currentPage - 1
        this.currentPage = currentPage
        this.getList()
      },
      getList() {
        this.getAllUserList({
          pageNo: this.page,
          pageSize: this.pageSize
        })
          .then((data) => {
            this.total = data.total
            this.userList = data.records
            console.log(this.userList)
          })
          .catch(()=> {
            this.userList = []
          })
      },
      showDialog(tip, next) {
        this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          next()
        }).catch(()=>{})
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '~STYLUS/color.styl'
#article-manage
  position: relative
  padding-top: 52px
  > p
    position: fixed
    width: 100%
    top: 0
    padding: 18px
    font-size: 16px
    font-weight: bold
    background-color: $color-white
    box-shadow: 1px 1px 10px 1px rgba(38, 42, 48, .1)
    z-index: 1000
  .article-table-wrap
    width: 100%
    animation: show .8s
    .pagination
      width: 100%
      margin: 20px 0
      display: flex
      justify-content: center

.article-title
  cursor: pointer
  &:hover
    color: #29b6f6

@keyframes show {
  from {
    margin-top: -10px;
    opacity: 0;
  }
  to {
    margin-top: 0px;
    opacity: 1;
  }
}
.button-container {
  display: flex;
  justify-content: flex-end; /* 让子元素靠右对齐 */
}
</style>
