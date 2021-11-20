<template>
  <div id="article-manage">
    <div class="article-table-wrap">
      <el-table
        :data="addressList"
        border
        stripe
        size="mini"
        style="width: 100%">
        <el-table-column
          prop="province"
          label="省份"
          show-overflow-tooltip
          width="300">
        </el-table-column>
        <el-table-column
          prop="city"
          label="地级市"
          show-overflow-tooltip
          width="300">
        </el-table-column>
        <el-table-column
          prop="country"
          label="县城(区县)"
          width="300">
        </el-table-column>
        <el-table-column
          prop="address"
          label="城市(具体地址)"
          width="300">
        </el-table-column>
        <el-table-column
          prop="duration"
          label="送货时间(小时)"
          width="300">
        </el-table-column>
        <el-table-column
          prop="distanceValue"
          label="系统距离(公里)"
          width="300">
        </el-table-column>
        <el-table-column
          prop="useDistance"
          label="使用距离(公里)"
          width="300">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              circle
              @click="edit(scope.row.articleId)">
            </el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="under(scope.row.articleId)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div
        class="pagination"
        v-show="addressList.length > 0">
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
  name: 'addressList',
  components: {
  },
  mixins: [scroll],
  data () {
    return {
      addressList: [],
      page: 0,
      pageSize: 15,
      currentPage: 0,
      total: 0
    }
  },
  created() {
    this.page = 0
    this.initData()
  },
  watch: {
    $route(route) {
      this.initData()
    }
  },
  methods: {
    ...mapActions([
      'listAddress',
      'deleteArticle'
    ]),
    write(){
      this.$router.push({name: 'editArticle'})
    },
    edit(articleId) {
      console.log(articleId)
      this.$router.push({
        name: 'editArticle',
        query: {
          id: articleId
        }
      })
    },
    under(articleId) {
      debugger
      console.log(articleId)
      this.showDialog('此操作会将该文章标记为删除，不再显示, 是否继续?', ()=> {
        this.deleteArticle(articleId)
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
    initData() {
      let taskId = this.$route.query.taskId
      this.listAddress({
        pageNo: this.page,
        pageSize: this.pageSize,
        taskId:taskId
      })
        .then((data) => {
          this.total = data.total
          this.addressList = data.rows
          console.log(this.addressList)
        })
        .catch(()=> {
          this.addressList = []
        })
    },
    getList() {
      let taskId = this.$route.query.taskId
      this.listAddress({
        pageNo: this.page,
        pageSize: this.pageSize,
        taskId:taskId
      })
        .then((data) => {
          this.total = data.total
          this.addressList = data.rows
        })
        .catch(()=> {
          this.addressList = []
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
</style>
