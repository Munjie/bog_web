<template>
  <div>
    <el-form v-model="queryParams" ref="queryForm" size="small" :inline="true" @submit.native.prevent>
      <el-form-item label="任务名称" prop="name">
        <el-input
          v-model.trim="queryParams.taskName"
          placeholder="请输入任务名称"
          clearable
          style="width:240px"
          @keyup.enter.native="handleQuery"
          clearable @clear="handleQuery(queryParams)"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="taskName"
        label="任务名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="email"
        label="收件人邮箱"
        width="300">
      </el-table-column>
      <el-table-column prop="status" label="状态"  width="300">
        <template slot-scope="scope">
          {{getLabel(getStatus,scope.row.status,'dictValue','dictLabel') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间">
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="300">
        <template slot-scope="scope">
          <el-button type="info" round @click="checkAll(scope.row.id)">查看</el-button>
          <el-button type="success" round @click="downloadExcel(scope.row.id)">下载</el-button>
          <el-button type="danger" round @click="deleteAll(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 15]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import axios from "axios";
import downLoadFile from "../../../util/fileutil";
const API_ROOT = 'http://www.munjie.com/blog'
const API_ROOT_DEV = 'http://localhost:8090/blog'

/* eslint-enable */
let url = (process.env.NODE_ENV === 'production' ? API_ROOT : API_ROOT_DEV)
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      taskName: "",
      dialogFormVisible: false,
      multipleSelection: [],
      //form表单查询的数据
      headerBg: "headerBg",
      queryParams: {
        taskName: '',
      },
      listData: [],
      fileList: [],
      getStatus: [
        {dictValue: 1,dictLabel:'处理中'},
        {dictValue: 2,dictLabel:'运行成功'},
        {dictValue: 3,dictLabel:'运行失败'}
      ],
    }
  },
  created() {
    this.handleQuery();
  },
  methods: {
    ...mapActions([
      'pageTask',
      'deleteTask'
    ]),
//搜索按钮
    handleQuery() {
      this.pageTask({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        taskName: this.queryParams.taskName,
      }).then(res => {
        debugger
        console.log("task数据：" + res)
        this.tableData = res.records
        console.log("dadadasdtttttttttt" + this.tableData)
        this.total = res.total
      })
        .catch(() => {
          this.addressList = []
        })
    },
    // 删除
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.handleQuery()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.handleQuery()
    },
    //重置按钮
    resetQuery() {
      //清空搜索栏
      this.queryParams = {
        taskName: '',
      }
      this.handleQuery()
    },
    getLabel(list, id, value, label) {
      if (id != '' && Array.isArray(list) && list.length != 0){
        return !list.find(item => item[value] == id) ? id : list.find(item => item[value] == id)[label]
      } else {
        return id
      }
    },
    deleteAll(id) {
      this.showDialog('确定删除?', ()=> {
        this.deleteTask(id)
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
<!--<script>-->
<!--import {-->
<!--  mapActions,-->
<!--  mapGetters-->
<!--} from 'vuex'-->

<!--import moment from 'moment'-->
<!--import { scroll } from 'MIXINS/scroll'-->
<!--import axios from "axios";-->

<!--export default {-->
<!--  name: 'article-manage',-->
<!--  components: {-->
<!--  },-->
<!--  mixins: [scroll],-->
<!--  data () {-->
<!--    return {-->
<!--      taskList: [],-->
<!--      page: 0,-->
<!--      pageSize: 15,-->
<!--      currentPage: 0,-->
<!--      total: 0,-->
<!--      data: null,-->
<!--      id: 0-->
<!--    }-->
<!--  },-->
<!--  created() {-->
<!--    this.page = 0-->
<!--    this.getList()-->
<!--  },-->
<!--  methods: {-->
<!--    ...mapActions([-->
<!--      'listTask',-->
<!--      'deleteTask'-->
<!--    ]),-->
<!--    write(){-->
<!--      this.$router.push({name: 'editArticle'})-->
<!--    },-->
<!--    downloadExcel(id) {-->
<!--      let x = new XMLHttpRequest();-->
<!--      let url;-->
<!--      //http://www.munjie.com/admin/leftMenu/taskList-->
<!--      if (process.env.NODE_ENV === 'production') {-->
<!--        url = 'http://www.munjie.com/blog/task/downloadExcel?taskId=' + id;-->
<!--      } else {-->
<!--        url = 'http://localhost:8088/blog/task/downloadExcel?taskId=' + id;-->
<!--      }-->
<!--      x.open("GET", url, true);-->
<!--      x.responseType = 'blob';-->
<!--      x.onload=function(e) {-->
<!--        var url = window.URL.createObjectURL(x.response)-->
<!--        var a = document.createElement('a');-->
<!--        a.href = url,-->
<!--        a.download = id;-->
<!--        a.click()-->
<!--      }-->
<!--      x.send();-->
<!--    },-->
<!--    checkAll(id) {-->
<!--      console.log(id)-->
<!--      this.$router.push({-->
<!--        name: 'addressList',-->
<!--        query: {-->
<!--          taskId: id-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    deleteAll(id) {-->
<!--      this.showDialog('确定删除?', ()=> {-->
<!--        this.deleteTask(id)-->
<!--          .then((data) => {-->
<!--            this.$toast('已删除')-->
<!--            this.page = 0-->
<!--            this.getList()-->
<!--          })-->
<!--          .catch((err)=> {-->
<!--            this.$toast(err.msg, 'error')-->
<!--          })-->
<!--      })-->
<!--    },-->
<!--    pageChange(currentPage) {-->
<!--      this.scrollToTarget(0, false)-->
<!--      this.page = currentPage-->
<!--      this.currentPage = currentPage-->
<!--      this.getList()-->
<!--    },-->
<!--    getList() {-->
<!--      this.listTask({-->
<!--        pageNo: this.page,-->
<!--        pageSize: this.pageSize-->
<!--      })-->
<!--        .then((data) => {-->
<!--          this.total = data.total-->
<!--          this.taskList = data.rows-->
<!--        })-->
<!--        .catch(()=> {-->
<!--          this.taskList = []-->
<!--        })-->
<!--    },-->
<!--    preview (article) {-->
<!--      this.$router.push({-->
<!--        name: 'articlePreview',-->
<!--        query: {-->
<!--          id: article.id-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    showDialog(tip, next) {-->
<!--      this.$confirm(tip, '提示', {-->
<!--        confirmButtonText: '确定',-->
<!--        cancelButtonText: '取消',-->
<!--        type: 'warning',-->
<!--        center: true-->
<!--      }).then(() => {-->
<!--        next()-->
<!--      }).catch(()=>{})-->
<!--    },-->
<!--  }-->
<!--}-->
<!--</script>-->

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
