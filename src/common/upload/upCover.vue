<template>
  <div
    class="cover-upload-wrap"
    ref=coverOutWrap
    :style="{
      width: width ? (width + 'px') : '100%',
      height: calcHeight + 'px',
      maxWidth: maxWidth ? (maxWidth + 'px') : '100px',
      maxHeight: maxHeight ? (maxHeight + 'px') : '100px'
    }">
<!--    <el-upload
      class="upload-demo"
      action="http://localhost:8088/blog/back/uploadImage"
      :limit="1"
      accept="image/*"
      :on-exceed = "onExceed"
      :on-change="handleChange"
      :on-success="uploadSuccess"
      :before-upload="beforeUnload"
      :beforeUpload="beforeAVatarUpload"
      :auto-upload="false"
      ref="upload"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>-->
    <el-upload
      ref="upload"
      class="cover-uploader"
      action="http://localhost:8088/blog/back/uploadImage"
      accept="image/*"
      :show-file-list="false"
      :auto-upload="false"
      :on-success="uploadSuccess"
      :before-upload="beforeUnload"
      :on-change="handleChange"
      :beforeUpload="beforeAVatarUpload">
      <div class="img-wrap">
        <img :src="imageUrl" class="cover" v-if="imageUrl">
        <div class="img-mask-default" :class="{'img-mask': imageUrl}">
          <i class="el-icon-upload"></i>
          <div>{{ tip }}</div>
        </div>
      </div>
    </el-upload>
    <button @click="sc">上传</button>
    <img :src="path" style="width: 100px"/>
<!--    <cropperBox
      ref="cropperBox"
      :options="options"
      :uploadProgress="uploadProgress"
      @finishCropImage="finishCropImage">
    </cropperBox>-->
  </div>
</template>
<script>
import {
  mapActions
} from 'vuex'

import cropperBox from './cropperBox'

export default {
  name: 'up-cover',
  components: {
    cropperBox
  },
  props: {
    defaultImg: String,
    ratio: { // 裁剪结果宽高比
      default: 1
    },
    width: Number,
    height: Number,
    WHRatio: { // 组件宽高比
      default: 1
    },
    maxWidth: String,
    maxHeight: String,
    tip: {
      default: '上传图片'
    },
    maxSize: { // 最大选择图片的大小，单位M
      default: 3
    }
  },
  data() {
    return {
      cropper: null,
      newFile: null,
      options: {
        aspectRatio: 1,
        preview: '#cropperRes',
        zoomOnWheel: false,
        minCropBoxWidth: 50
      },
      token: {},
      uploadProgress: 0,
      calcHeight: 0,
      fileList: [],
      path: '',
    }
  },
  created() {
    this.options.aspectRatio = this.ratio
    if (this.height) {
      this.calcHeight = this.height
    }
  },
  computed: {
    imageUrl() {
      return this.defaultImg
    }
  },
  mounted() {
    if (!this.calcHeight) {
      if (this.width) {
        this.calcHeight = this.width / this.WHRatio
      } else {
        this.calcHeight = this.$refs.coverOutWrap.offsetWidth / this.WHRatio
      }
    }
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
      console.log(fileList)
    },
    handleAvatarSuccess() {
      this.$message({type: 'success', message: '上传成功', showClose: true});
    },
    uploadSuccess(e) {
      this.path =  e.message;
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
        debugger
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
    }
  }
}


</script>
<style lang="stylus">
@import '~STYLUS/color.styl'
.cover-upload-wrap
  position: relative
  width: 100%
  max-width: 300px
  height: 150px
  border-radius: 5px
  .cover-uploader
    width: 100%
    height: 100%
    .el-upload
      width: 100%
      height: 100%
      overflow: hidden
      border-radius: 5px
      cursor: pointer
      border: 1px solid #dddddd
      .img-wrap
        position: relative
        width: 100%
        height: 100%
        &:hover
          .img-mask-default
            opacity: 1
            background-color: rgba(0, 0, 0, 0.5)
            color: $color-white
        .cover
          position: relative
          width: 100%
          height: 100%
          border-radius: 5px
        .img-mask-default
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
          padding-left: 10px
          padding-right: 10px
          background-color: $color-white
          color: #555555
          display: flex
          flex-direction: column
          justify-content: center
          font-size: 12px
          transition: all .2s linear
          .el-icon-upload
            font-size: 18px
        .img-mask
          opacity: 0

</style>
