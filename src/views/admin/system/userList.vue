<template>
  <div id="article-manage">
    <div class="article-table-wrap">
      <div class="button-container">
      <el-button type="primary" icon="el-icon-edit" @click="openAddDialog()">新增用户</el-button>
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
        <el-table-column label="角色" align="center">
          <template slot-scope="scope">
            <el-tag
              v-for="(roleName, index) in scope.row.roleName"
              :key="index"
              type="success"
              effect="dark"
              style="margin-right: 5px; margin-bottom: 5px;"
            >
              {{ roleName }}
            </el-tag>
            <span v-if="!scope.row.roleName || scope.row.roleName.length === 0">无角色</span>
          </template>
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
              @click="openEditDialog(scope.row)">
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="remove(scope.row.id)">
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
    <!-- 新增/编辑用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
            <el-option
              v-for="role in roles"
              :key="role.id"
              :label="role.roleName"
              :value="role.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveUser">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
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
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        form: {
          id: null,
          userName: '',
          password: '',
          roleIds: []
        },
        dialogVisible: false,
        dialogTitle: '',
        roles: [],
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
      this.loadRoles()
    },
    methods: {
      ...mapActions([
        'getAllUserList',
        'deleteUser',
        'listAllRole',
        'registerUser',
      ]),
      openAddDialog() {
        this.title = '新增用户'
        this.form = { id: null, userName: '', password: '', roleId: [] }
        this.open = true
      },
      openEditDialog(user) {
        this.title = '编辑用户'
        this.form = {
          id: user.id,
          userName: user.userName,
          password: user.password,
          roleIds: Array.isArray(user.roleIds) ? [...user.roleIds] : []
        }
        this.open = true
      },
      // 取消按钮
      cancel() {
        this.open = false;
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(() => {
            done()
          })
          .catch(() => {})
      },
      async loadRoles(){
        this.listAllRole().then(res => {
          this.roles = res
        })
          .catch(() => {
            this.roles = []
          })
      },
      async saveUser() {
        let params = {
          userName: this.form.userName,
          password: this.form.password,
          roleIds: this.form.roleIds,
          id: this.form.id,
        }
        this.registerUser(params)
          .then((data) => {
            this.$toast(data)
            this.open = false;
            this.page = 0
            this.getList()
          })
          .catch((err) => {
            this.$toast(err.msg, 'error')
          })
      },
      remove(id) {
          this.deleteUser(id).then((data) => {
              this.$toast('已删除')
              this.page = 0
              this.getList()
            })
            .catch((err)=> {
              this.$toast(err.msg, 'error')
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
.user-manage {
  padding: 20px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.el-select {
  width: 100%;
}
.el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
