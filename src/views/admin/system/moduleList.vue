<template>
  <div id="article-manage">
    <div class="article-table-wrap">
      <div id="addMo">
        <el-button type="primary">新增模块</el-button>
      </div>
      <el-table
        :data="moduleList"
        border
        stripe
        size="mini"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          show-overflow-tooltip
          width="300">
        </el-table-column>
        <el-table-column
          prop="moduleId"
          label="模块ID"
          show-overflow-tooltip
          width="300">
        </el-table-column>
        <el-table-column
          prop="url"
          label="路径"
          show-overflow-tooltip
          width="300">
        </el-table-column>
        <el-table-column
          prop="name"
          label="模块名称"
          show-overflow-tooltip
          width="300">
        </el-table-column>
        <el-table-column
          prop="imgUrl"
          label="图标"
          width="300">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          width="300">
        </el-table-column>
          <el-table-column
            prop="parent"
            label="父级"
            width="300">
          </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="300">
          <template slot-scope="scope">
            <el-button type="info" round @click="checkAll(scope.row.id)">查看</el-button>
            <el-button type="danger" round @click="deleteAll(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div
        class="pagination"
        v-show="moduleList.length > 0">
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
import axios from "axios";

export default {
  name: 'moduleList',
  components: {
  },
  mixins: [scroll],
  data () {
    return {
      moduleList: [],
      page: 0,
      pageSize: 15,
      currentPage: 0,
      total: 0,
      data: null,
      taskId: ''
    }
  },
  created() {
    this.page = 0
    this.getList()
  },
  methods: {
    ...mapActions([
      'listModule',
      'deleteModule'
    ]),
    checkAll(taskId) {
      console.log(taskId)
      this.$router.push({
        name: 'addressList',
        query: {
          taskId: taskId
        }
      })
    },
    deleteAll(id) {
      this.showDialog('确定删除?', ()=> {
        this.deleteModule(id)
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
      this.page = currentPage
      this.currentPage = currentPage
      this.getList()
    },
    getList() {
      this.listModule({
        pageNo: this.page,
        pageSize: this.pageSize
      })
        .then((data) => {
          this.total = data.total
          this.moduleList = data.rows
        })
        .catch(()=> {
          this.moduleList = []
        })
    },
    preview (article) {
      this.$router.push({
        name: 'articlePreview',
        query: {
          id: article.id
        }
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
    },
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
  #addMo
    float right
    margin-right 10px
    margin-bottom 10px
</style>
