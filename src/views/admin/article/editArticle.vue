<template>
  <div id="edit-article">
    <div class="header-wrap">
      编辑文章
      <div class="action-btn-wrap">
        <span @click="save">保存</span>
      </div>
    </div>
    <div class="edit-wrap">
      <mavon-editor
        class="editor"
        v-model="article.content"
        ref=md
        @imgAdd="$imgAdd"
        :boxShadow="true"
        defaultOpen="edit"
        :subfield = "true"
        :defaultOpen = "'preview'"
        :editable="true"
        :scrollStyle="true"
        :ishljs = "true"
        :toolbars="{
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: false, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: false, // 展示html源码
          help: true, // 帮助
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: false, // 保存（触发events中的save事件）
          navigation: false, // 导航目录
          alignleft: false, // 左对齐
          aligncenter: false, // 居中
          alignright: false, // 右对齐
          subfield: true, // 单双栏模式
          preview: true, // 预览
        }"/>
      <div class="input-wrap">
        <div class="fix-input-wrap">
<!--          <UP class="upload-cover"
              :default-img="article.articleImage"
              ratio="2"
              WHRatio="2"
              maxWidth="300"
              maxHeight="150"
              tip="上传文章封面图"
              maxSize="2"
              @uploadSuccess="uploadSuccess"></UP>-->
          <el-upload
            class="upload-demo"
            action="http://localhost:8088/blog/back/uploadImage"
            accept="image/*"
            :on-exceed="onExceed"
            :on-change="handleChange"
            :on-success="uploadSuccess"
            :before-upload="beforeUnload"
            :beforeUpload="beforeAVatarUpload"
            :auto-upload="false"
            ref="upload">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <button @click="sc">上传</button>
          <img :src="path" style="width: 100px"/>
          <el-input
            class="input-title"
            size="mini"
            v-model="article.title"
            placeholder="请输入文章标题">
          </el-input>
          <el-input
            class="input-title"
            type="textarea"
            size="mini"
            :rows="6"
            :maxlength="150"
            resize="none"
            v-model="article.introduction"
            placeholder="请输入文章简介">
          </el-input>
          <!--          <div class="label-wrap">-->
          <!--            分类：-->
          <!--            <el-select-->
          <!--              v-model="category"-->
          <!--              filterable-->
          <!--              allow-create-->
          <!--              default-first-option-->
          <!--              size="mini"-->
          <!--              placeholder="请选择文章分类">-->
          <!--              <el-option-->
          <!--                v-for="item in categoryList"-->
          <!--                size="mini"-->
          <!--                :key="item.categoryId"-->
          <!--                :label="item.categoryName"-->
          <!--                :value="item.categoryName">-->
          <!--              </el-option>-->
          <!--            </el-select>-->
          <!--          </div>-->
          <div class="label-wrap">
            标签：
            <el-select
              v-model="tags"
              filterable
              allow-create
              default-first-option
              size="mini"
              multiple
              placeholder="请选择文章标签">
              <el-option
                v-for="(item, index) in tagList"
                size="mini"
                :key="index"
                :label="item.tagName"
                :value="item.tagName">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapActions,
    mapGetters
  } from 'vuex'

  import { mavonEditor } from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import UP from 'COMMON/upload/upCover.vue'
  import { markdown } from 'UTIL/markdown'

  export default {
    name: 'edit-article',
    components: {
      mavonEditor,
      UP
    },
    data () {
      return {
        isEncrypt: false,
        article: {
          id : '',
          content: '',
          title: '',
          image: '',
          introduction: ''
        },
        category: '',
        tags: [],
        categoryList: [],
        tagList: [],
        path: ''
      }
    },
    created() {
      this.initData()
    },
    watch: {
      $route(route) {
        this.initData()
      }
    },
    methods: {
      ...mapActions([
        'getQiniuToken',
        'uploadToQiniu',
        'getArticle',
        'getCategoryList',
        'getEditTagList',
        'saveArticle',
        'publishArticle',
        'modifyArticle'
      ]),
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-3);
        console.log(fileList)
      },
      handleAvatarSuccess() {
        this.$message({type: 'success', message: '上传成功', showClose: true});
      },
      uploadSuccess(e) {
        this.path =  e.message;
        console.log(this.path + 895656565)
        console.log(e.message)
      },
      beforeUnload() {
        //自动上传触发
        if (this.fileList.length > 1) {
          this.fileList.splice(1, 1);
          this.$message({type: 'info', message: '请删除资源后重新上传', showClose: true});
          return false;
        }

        return true;
      },
      sc() {
        //手动提交
        //和表单一起提交，先提交图片，后提交表单
        this.$refs.upload.submit()
      },
      onExceed() {
        //手动上传限制
        this.$message({type: 'info', message: '请删除资源后重新选择', showClose: true});
      },
      beforeAVatarUpload(file) {
        let _this = this
        //resolve:同意
        //reject:拒绝
        return new Promise((resolve, reject) => {
          let isLt2M = file.size / 1024 / 1024 > 0.1 // 判定图片大小是否小于100k
          if (!isLt2M) {
            resolve()
          }
          let image = new Image(), resultBlob = '';
          image.src = URL.createObjectURL(file);
          image.onload = () => {
            // 调用方法获取blob格式，方法写在下边
            resultBlob = _this.compressUpload(image);
            resolve(resultBlob)
          }
          image.onerror = () => {
            reject()
          }
        })
      },

      /* 图片压缩方法-canvas压缩 */
      compressUpload(image) {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let initSize = image.src.length
        let {width} = image, {height} = image
        canvas.width = width
        canvas.height = height
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(image, 0, 0, width, height)

        // 进行最小压缩0.1
        let compressData = canvas.toDataURL('image/jpeg', 0.1)

        // 压缩后调用方法进行base64转Blob，方法写在下边
        let blobImg = this.dataURItoBlob(compressData)
        return blobImg
      },

      /* base64转Blob对象 */
      dataURItoBlob(data) {
        let byteString;
        if (data.split(',')[0].indexOf('base64') >= 0) {
          byteString = atob(data.split(',')[1])
        } else {
          byteString = unescape(data.split(',')[1])
        }
        let mimeString = data
          .split(',')[0]
          .split(':')[1]
          .split(';')[0];
        let ia = new Uint8Array(byteString.length)
        for (let i = 0; i < byteString.length; i += 1) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ia], {type: mimeString})
      },
      initData() {
        let id = this.$route.query.id
          this.article = {
            id : '',
            content: '',
            title: '',
            image: '',
            introduction: ''
          },
          this.classification = '',
          this.tags = []
        if (id) {
          this.getArticle(id)
            .then((data) => {
              this.article = data
              // this.init(data.classification, data.tags)
            })
            .catch(()=> {})
        }
        // this.getCategoryList({all: true})
        //   .then((data) => {
        //     this.categoryList = data.list
        //   })
        //   .catch(()=> {})
        /*this.getEditTagList()
          .then((data) => {
            this.tagList = data
          })
          .catch(()=> {})*/
      },
      init(oldTategory, oldTags) {
        this.category = oldTategory.name
        oldTags.forEach(item => {
          this.tags.push(item.name)
        })
      },
      $imgAdd(pos, $file) {
        let formParams = new FormData()
        formParams.append('file', $file)
        this.startUploadImg(formParams, pos)

      },
      startUploadImg(formParams, pos) {
        this.uploadToQiniu(formParams)
          .then((data) => {
            this.$refs.md.$img2Url(pos, data.message)
          })
          .catch((err) => {
            this.$toast('上传失败', 'error')
          })
      },
      // uploadSuccess(url) {
      //   console.log("985623232"+url)
      //   this.article.articleImage = url
      // },
      // getCategory() {
      //   let category = this.categoryList.find(item => item.categoryName === this.category)
      //   if (category) {
      //     return {id: category.categoryId}
      //   } else {
      //     return {name: this.category}
      //   }
      // },
      getTags() {
        let tags = []
        this.tags.forEach(value => {
          let tag = this.tagList.find(item => item.tagName === value)
          if (tag) {
            tags.push(value)
          } else {
            tags.push(value)
          }
        })
        return tags
      },
      markdownHtml(str) {
        return markdown(str)
      },
      getParams() {
        let html = this.markdownHtml(this.article.content)
        let params = {
          id: this.$route.query.id,
          title: this.article.title,
          content: html,
          introduction: this.article.introduction,
          image: this.path
        }
       // params.category = this.getCategory()
       /* params.tags = this.getTags()
        if (this.article.id) {
          params.id = this.article.id
        }*/
        return params
      },
      publish() {
        let params = this.getParams()
        if (!params.title) {
          this.$toast('文章标题不能为空', 'error')
          return
        }
        if (!params.introduction) {
          this.$toast('文章简介不能为空', 'error')
          return
        }
        if (!params.content) {
          this.$toast('文章内容不能为空', 'error')
          return
        }
      },
      save() {
        let params = this.getParams()
        this.saveArticle(params)
          .then((data) => {
            this.$toast('已保存')
            this.updateRoute('editArticle', data)
          })
          .catch((err) => {
            this.$toast(err.msg, 'error')
          })
      },
      modify() {
        let params = this.getParams()
        if (!params.id) {
          this.$toast('文章id不能为空', 'error')
          return
        }
        if (!params.title) {
          this.$toast('文章标题不能为空', 'error')
          return
        }
        if (!params.subMessage) {
          this.$toast('文章简介不能为空', 'error')
          return
        }
        if (!params.content) {
          this.$toast('文章内容不能为空', 'error')
          return
        }
        this.modifyArticle(params)
          .then((data) => {
            this.$toast('已更新')
          })
          .catch((err) => {
            this.$toast(err.msg, 'error')
          })
      },
      updateRoute(name, articleId) {
        this.$router.push({
          name: name,
          query: {
            id: articleId
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '~STYLUS/color.styl'
#edit-article
  position: relative
  padding-top: 52px
  .header-wrap
    position: absolute
    width: 100%
    top: 0
    padding: 18px
    font-size: 16px
    font-weight: bold
    background-color: $color-white
    box-shadow: 1px 1px 10px 1px rgba(38, 42, 48, .1)
    z-index: 1000
    display: flex
    flex-direction: row
    justify-content: space-between
    align-items: center
    .action-btn-wrap
      > span
        padding: 5px 10px
        margin-right: 5px
        font-size: 14px
        cursor: pointer
        background-color: $color-main
        color: $color-white
        border-radius: 8px
        &:hover
          background-color: lighten($color-main, 10%)
        &:last-child
          margin-right: 0px
  .edit-wrap
    padding: 30px 10px
    padding-top: 10px
    animation: show .8s
    display: flex
    flex-direction: row
    @media (max-width: 1324px)
      flex-direction: column-reverse
    .input-wrap
      position: relative
      width: 300px
      margin-left: 10px
      transition: all .3s
      @media (max-width: 1324px)
        width: 100%
        margin-left: 0px
        margin-bottom: 10px
      .fix-input-wrap
        position: relative
        width: 300px
        height: calc(100vh - 112px)
        transition: all .3s
        display: flex
        flex-direction: column
        align-items: center
        @media (max-width: 1324px)
          width: 100%
          height: auto
        .upload-cover
          margin-bottom: 10px
        .input-title
          margin-bottom: 10px
        .label-wrap
          color: #606266
          font-size: 14px
          width: 100%
          margin-bottom: 10px
          .el-select
            width: calc(100% - 46.7px) !important
    .editor
      min-width: calc(100% - 310px)
      height: calc(100vh - 112px)


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

<style lang="stylus">
.v-note-wrapper
  z-index: 1 !important
[type="button"]
  -webkit-appearance: none
</style>
