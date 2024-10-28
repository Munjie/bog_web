<template>
  <div id="article-manage">
    <div class="article-table-wrap">
      <el-table
        :data="taskList"
        border
        stripe
        size="mini"
        style="width: 100%">
        <el-table-column
          prop="taskId"
          label="任务ID"
          show-overflow-tooltip
          width="300">
        </el-table-column>
        <el-table-column
          prop="taskName"
          label="任务名称"
          show-overflow-tooltip
          width="300">
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          width="300">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="300">
          <template slot-scope="scope">
            <el-button type="info" round @click="checkAll(scope.row.taskId)">查看</el-button>
            <el-button type="success" round @click="downloadExcel(scope.row.taskId)">下载</el-button>
            <el-button type="danger" round @click="deleteAll(scope.row.taskId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div
        class="pagination"
        v-show="taskList.length > 0">
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
  name: 'article-manage',
  components: {
  },
  mixins: [scroll],
  data () {
    return {
      taskList: [],
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
      'listTask',
      'deleteTask'
    ]),
    write(){
      this.$router.push({name: 'editArticle'})
    },
    downloadExcel(taskId) {
      let x = new XMLHttpRequest();
      let url;
      //http://www.munjie.com/admin/leftMenu/taskList
      if (process.env.NODE_ENV === 'production') {
        url = 'http://www.munjie.com/blog/task/downloadExcel?taskId=' + taskId;
      } else {
        url = 'http://localhost:8088/blog/task/downloadExcel?taskId=' + taskId;
      }
      x.open("GET", url, true);
      x.responseType = 'blob';
      x.onload=function(e) {
        var url = window.URL.createObjectURL(x.response)
        var a = document.createElement('a');
        a.href = url,
        a.download = taskId;
        a.click()
      }
      x.send();
    },
    checkAll(taskId) {
      console.log(taskId)
      this.$router.push({
        name: 'addressList',
        query: {
          taskId: taskId
        }
      })
    },
    deleteAll(taskId) {
      this.showDialog('确定删除?', ()=> {
        this.deleteTask(taskId)
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
      this.listTask({
        pageNo: this.page,
        pageSize: this.pageSize
      })
        .then((data) => {
          this.total = data.total
          this.taskList = data.rows
        })
        .catch(()=> {
          this.taskList = []
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
</style>
