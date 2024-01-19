<template>
  <div id="home" v-loading="loading">
    <article-card
      v-for="(article, index) in articleList"
      :key="index"
      :article="article" />
    <!-- 分页 -->
    <div class="pagination" v-if="articleList.length > 0">
      <!-- ...............分页................... -->
      <el-pagination
        class="column-page"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageNo"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 分页 结束 -->
    <no-data
      v-if="total === 0"
      text="没有找到文章~"/>
  </div>
</template>

<script>
  import {
    mapActions,
    mapGetters
  } from 'vuex'

  import { scroll } from 'MIXINS/scroll'

  import articleCard from 'COMMON/articleCard/articleCard'
  import noData from 'COMMON/noData/noData'

  export default {
    name: 'home',
    components: {
      articleCard,
      noData
    },
    mixins: [scroll],
    data () {
      return {
        articleList: [],
        //当前的页数
        pageNo: 1,
        //当前每页的条数
        pageSize: 5,
        currentPage: 0,
        //总数据条数
        total: 0,
        loading: false
      }
    },
    created() {
      //this.pageNo = 0
     // this.getList()
    },
    methods: {
      ...mapActions([
        'getBlogArticleList'
      ]),
      async getList() {
        this.loading = true
        this.getBlogArticleList({
          pageNo: this.pageNo,
          pageSize: this.pageSize
        })
          .then((data) => {
            console.log(99999999 + data)
            this.total = data.total
            this.articleList = data.rows
            this.loading = false
          })
          .catch(()=> {
            this.articleList = []
            this.loading = false
          })
      },
      //监听pagesize改变的事件
      handleSizeChange(newSize) {
        this.pageSize = newSize;
        this.getList()
      },
      //监听页码值改变的事件
      handleCurrentChange(newPage) {
        this.pageNo = newPage;
        this.getList()
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '~STYLUS/color.styl'
#home
  position: relative
  padding: 30px 10px
  min-height: 100px
  .pagination
    width: 100%
    padding: 10px 0
    display: flex
    display: -webkit-flex
    flex-direction: row
    justify-content: center
    background-color: $color-white


.slide-fade-enter
.slide-fade-leave-to
  opacity: 0
</style>
