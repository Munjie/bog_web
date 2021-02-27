<template>
  <div id="search" v-loading="loading">
    <div class="search-article-wrap">
      <article-card2
        v-for="(article, index) in articleList"
        :key="index"
        :article="article" />
    </div>
    <!-- 分页 -->
    <div class="pagination" v-if="articleList.length > 0">
      <el-pagination
        class="column-page"
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 分页 结束 -->
    <no-data
      v-if="total === 0"
      text="糟糕,未搜索到..."/>
  </div>
</template>

<script>
  import {
    mapActions
  } from 'vuex'

  import { scroll } from 'MIXINS/scroll'
  import articleCard2 from 'COMMON/articleCard/articleCard2'
  import noData from 'COMMON/noData/noData'

  export default {
    name: 'search',
    components: {
      articleCard2,
      noData
    },
    mixins: [scroll],
    data () {
      return {
        pageNo: 0,
        pageSize: 5,
        currentPage: 0,
        total: 0,
        type: 'category',
        id: '',
        articleList: [],
        loading: false,
        content: '',
        timeoutId: ""
      }
    },
    created() {
    },
    mounted() {
      this.initData()
    },
    watch: {
      $route(route) {
        this.initData()
      }
    },
    methods: {
      ...mapActions([
        'searchArticle'
      ]),
      initData() {
        this.content = this.$route.query.value
        this.total = 0
        this.articleList = []
        this.pageNo = 0
        if (this.content || this.content == '0') {
          this.getList()
        } else {
          document.getElementById('search-input').focus()
        }
      },
      getList() {
        this.loading = true
        this.searchArticle({
          content: this.content,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        })
          .then((data) => {
            this.total = data.total
            this.articleList = data.rows
            this.loading = false
          })
          .catch(()=> {
            this.articleList = []
            this.loading = false
          })
      },
      toSearch() {
        /*  if (this.content === '') {
            this.$toast('搜索内容不能为空', 'error')
            return
          }*/
        this.$router.push({
          name: 'search',
          query: {
            value: this.content
          }
        })
      },
      //监听pagesize改变的事件
      handleSizeChange(newSize) {
        this.pageSize = newSize;
        this.getList()
      },
      //监听页码值改变的事件
      handleCurrentChange(newPage) {
        this.scrollToTarget(0, false);
        this.pageNo = newPage-1;
        this.currentPage = newPage;
        this.getList()
      },
      handleInput() {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
        }
        this.timeoutId = setTimeout(this.toSearch, 600)
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '~STYLUS/color.styl'
#search
  position: relative
  padding: 30px 10px
  display: flex
  flex-direction: column
  align-items: center
  .pagination
    width: 100%
    padding: 10px 0
    display: flex
    display: -webkit-flex
    flex-direction: row
    justify-content: center
    background-color: $color-white
  .search-input-wrap
    width: 100%
    max-width: 900px
    height: 30px
    border-radius: 5px
    border: 1px solid #eeeeee
    .search-real-input
      width: 100%
      height: 28px
      padding: 5px 10px
      border-radius: 5px
      border: none
      font-size: 14px
      background-color: $color-white
      &::placeholder
        color: $text-tip
  .search-article-wrap
    position: relative
    width: 100%
    padding: 10px 30px
    animation: show .8s
    @media (max-width: 768px)
      padding: 5px
    .time-line
      position: absolute
      left: 30px
      @media (max-width: 768px)
        left: 5px
      top: 15px
      bottom: 0
      width: 2px
      background-color: #eeeeee

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
