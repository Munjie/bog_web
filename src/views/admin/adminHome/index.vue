<!--
<template>
  <div id="admin-home">
    <p>首页</p>
    <div class="card-wrap">
      <icon-card
        v-for="(item, index) in messageCards"
        :key="index"
        :backgroundColor="item.backgroundColor"
        :icon="item.icon"
        :topMessage="item.topMessage"
        :middleMessage="item.middleMessage"
        :bottomMessage="item.bottomMessage"
        :to="item.to"/>
    </div>
    <div class="card-wrap">
      <message-card title="">
        <div slot="content">
          <div class="article-content" v-for="(article, index) in newestArticleList" :key="index">
            <span class="article-title" @click="$router.push({name: 'articlePreview', query:{id: article.id}})">{{ article.title }}</span>
            <span class="time"><i class="iconfont icon-calendar"></i>{{ article.publishTime | time }}</span>
          </div>
          <p class="more" @click="$router.push({name: 'articleManage'})">更多</p>
        </div>
      </message-card>
    </div>
  </div>
</template>
<script>
  import {
    mapActions,
    mapGetters
  } from 'vuex'

  import iconCard from 'VIEWS/admin/adminHome/iconCard'
  import messageCard from 'VIEWS/admin/adminHome/messageCard'
  import SockJS from  'sockjs-client';
  import  Stomp from 'stompjs'

  export default {
    name: 'admin-home',
    components: {
      iconCard,
      messageCard
    },
    data() {
      return {
        messageCards: [
          {
            backgroundColor: '#29b6f6',
            icon: 'icon-article',
            topMessage: '共发表了',
            middleMessage: '0',
            bottomMessage: '篇文章',
            to: 'articleManage'
          },
          {
            backgroundColor: '#7e57c2',
            icon: 'icon-drafts',
            topMessage: '草稿箱共有',
            middleMessage: '0',
            bottomMessage: '篇文章',
            to: 'articleDrafts'
          },
          {
            backgroundColor: '#33b86c',
            icon: 'icon-deleted',
            topMessage: '垃圾箱共有',
            middleMessage: '0',
            bottomMessage: '篇文章',
            to: 'articleDeleted'
          },
          {
            backgroundColor: '#6e8cd7',
            icon: 'icon-tag',
            topMessage: '共有',
            middleMessage: '0',
            bottomMessage: '个分类/标签',
            to: 'adminCategories'
          },
          {
            backgroundColor: '#E6A23C',
            icon: 'icon-comments',
            topMessage: '共有',
            middleMessage: '0',
            bottomMessage: '条评论',
            to: 'adminComments'
          }
        ],
        newestArticleList: [],
        sysLogList: [],
        logParams: {
          page: 0,
          pageSize: 8
        },
        hadMoreLog: false,
        loadLogMore: false,
        stompClient: null
      }
    },
    created() {
    },
    methods: {
      ...mapActions([
        'getHomeStatistics',
      ])
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~STYLUS/color.styl'
  @import '~STYLUS/mixin.styl'
  #admin-home
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

    .card-wrap
      position: relative
      animation: show .8s
      margin: 10px
      display: flex
      flex-direction: row
      flex-wrap: wrap
      align-items: flex-start

      .article-content
        padding: 15px 10px
        margin: 0px 10px
        border: 1px solid #eeeeee
        border-top: 0px
        @media (max-width: 759px)
          font-size: 12px
          padding: 10px
        font-size: 14px
        color: #555555
        position: relative
        display: flex
        flex-direction: row
        align-items: center
        justify-content: space-between

        &:first-child
          margin-top: 10px
          border-top: 1px solid #eeeeee

        .article-title
          position: relative
          cursor: pointer
          flex: 1
          padding-bottom: 2px
          single-text-ellipsis()
          transition: color .3s

          &:hover
            color: #29b6f6

        .time
          color: #999999
          margin-left: 10px

          .iconfont
            font-size: 14px
            margin-right: 5px

      .log-content
        padding: 15px 10px
        margin: 0px 10px
        border: 1px solid #eeeeee
        border-top: 0px
        font-size: 14px
        color: #555555
        @media (max-width: 759px)
          font-size: 12px
          padding: 10px

        &:first-child
          margin-top: 10px
          border-top: 1px solid #eeeeee

        &:last-child
          margin-bottom: 10px

        > p
          margin-bottom: 3px

      .more
        padding: 10px
        margin-top: 10px
        text-align: center
        font-size: 14px
        @media (max-width: 759px)
          font-size: 12px
        color: #555555
        background-color: #f9f9f9
        cursor: pointer
        transition: all .3s

        &:hover
          background-color: $color-main
          color: $color-white

      .more-log
        margin-top: 10px
        text-align: center
        font-size: 14px
        display: flex
        flex-direction: row
        @media (max-width: 759px)
          font-size: 12px

        > span
          color: #555555
          background-color: #f9f9f9
          cursor: pointer
          padding: 10px
          flex: 1
          transition: all .3s

          &:hover
            background-color: $color-main
            color: $color-white


  @keyframes show {
    from {
      margin-top: 0px;
      opacity: 0;
    }
    to {
      margin-top: 10px;
      opacity: 1;
    }
  }
</style>
-->
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
          prop="originAdd"
          label="起始地址"
          show-overflow-tooltip
          width="300">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="300">
        </el-table-column>
        <el-table-column
          prop="taskDescription"
          label="备注"
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
      let url;
      //http://www.munjie.com/admin/leftMenu/taskList
      if (process.env.NODE_ENV === 'production') {
        url = 'http://www.munjie.com/blog/task/downloadExcel?taskId=' + taskId;
      } else {
        url = 'http://localhost:8088/blog/task/downloadExcel?taskId=' + taskId;
      }
      console.log("8888:"+url)
      let x = new XMLHttpRequest();
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
      this.page = currentPage - 1
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
