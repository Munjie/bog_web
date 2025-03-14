<template>
  <div id="article-manage">
    <div class="article-table-wrap">
      <div class="button-container">
      <el-button type="primary" icon="el-icon-edit" @click="addArticle()">新增文章</el-button>
      </div>
      <el-table
        :data="articleList"
        border
        stripe
        size="mini"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="文章标题"
          show-overflow-tooltip
          align="center">
        </el-table-column>
        <el-table-column
          label="封面图"
          align="center">
          <template slot-scope="scope">
            <img
              v-if="scope.row.image"
              :src="scope.row.image"
              style="width: 100%;height: 20px; cursor: pointer"
              @click="previewImg">
          </template>
        </el-table-column>
        <el-table-column
          prop="classification"
          label="分类"
          show-overflow-tooltip
          align="center">
        </el-table-column>
        <el-table-column
          prop="views"
          label="阅读量"
          align="center">
        </el-table-column>
        <el-table-column prop="status" label="是否发布" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              class="switch"
              active-text="已发布"
              inactive-text="未发布"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="publishTime"
          label="发布时间"
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
              @click="under(scope.row.id)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div
        class="pagination"
        v-show="articleList.length > 0">
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
    name: 'article-manage',
    components: {
    },
    mixins: [scroll],
    data () {
      return {
        articleList: [],
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
        'getAllArticleList',
        'deleteArticle',
        'updateArticleStatus'
      ]),
      write(){
        this.$router.push({name: 'editArticle'})
      },
      formatTime(row, column, cellValue, index) {
        return cellValue ? moment(parseInt(cellValue) * 1000).format('YYYY-MM-DD HH:mm') : '-'
      },
      formatStatus(value) {
        return value == '0' ? '已发布' : '-'
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
      addArticle() {
        this.$router.push({
          name: 'editArticle',
          query: {
            id: ""
          }
        })
      },
      handleStatusChange(row) {
        let params = {
          id: row.id,
          status: row.status,
        }
        this.updateArticleStatus(params)
          .then((data) => {
            this.$toast('已更新')
            this.getList()
          })
          .catch((err) => {
            this.$toast(err.msg, 'error')
          })
      },
      under(articleId) {
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
        this.page = currentPage - 1
        this.currentPage = currentPage
        this.getList()
      },
      getList() {
        this.getAllArticleList({
          pageNo: this.page,
          pageSize: this.pageSize
        })
          .then((data) => {
            this.total = data.total
            this.articleList = data.records
            console.log(this.articleList)
          })
          .catch(()=> {
            this.articleList = []
          })
      },
      previewImg(e) {
        this.$photoPreview.open(0, [{src: e.target.src, w: 40, h: 20, target: e.target}])
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
