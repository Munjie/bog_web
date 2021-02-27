<template>
  <div id="article-manage">
    <div class="article-table-wrap">
      <el-table
        :data="articleList"
        border
        stripe
        size="mini"
        style="width: 100%">
        <el-table-column
          label="标题"
          show-overflow-tooltip
          min-width="200">
          <template slot-scope="scope">
            <div class="article-title" @click="preview(scope.row.articleId)">{{ scope.row.articleTitle || '无标题' }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="封面图"
          width="61">
          <template slot-scope="scope">
            <img
              v-if="scope.row.cover"
              :src="scope.row.cover"
              style="width: 100%;height: 20px; cursor: pointer"
              @click="previewImg">
          </template>
        </el-table-column>
        <el-table-column
          prop="categoryName"
          label="分类"
          show-overflow-tooltip
          width="120">
        </el-table-column>
        <el-table-column
          prop="articleViews"
          label="阅读量"
          width="60">
        </el-table-column>
        <el-table-column
          label="发布"
          width="45">
          <template slot-scope="scope">
            {{ scope.row.status === '0' ? '否' : '是' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="articleCreateTime"
          label="创建时间"
          width="128"
          :formatter="formatTime">
        </el-table-column>
        <el-table-column
          prop="articlePublishTime"
          label="发布时间"
          width="128"
          :formatter="formatTime">
        </el-table-column>
        <el-table-column
          prop="articleUpdateTime"
          label="更新时间"
          width="128"
          :formatter="formatTime">
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="112">
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
        'getBackList',
        'deleteArticle'
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
        this.page = currentPage - 1
        this.currentPage = currentPage
        this.getList()
      },
      getList() {
        this.getBackList({
          pageNo: this.page,
          pageSize: this.pageSize
        })
          .then((data) => {
            this.total = data.total
            this.articleList = data.rows
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
</style>
