<template>
  <div>
    <el-upload
      v-show="!resultFlag"
      ref="upload"
      class="upload-wrapper"
      drag
      :action="''"
      :with-credentials="true"
      :multiple="false"
      :data="{info:uploadInfo}"
      accept=".xls,.xlsx"
      :before-upload="beforeUpload">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传Excle文件</div>
    </el-upload>
    <div class="upload-result" v-show="resultFlag">
      <div class="result-success">
        <img src="/../../../assets/images/icon_chengg.png" alt="">
        <span>成功导入了<strong style="font-size: 20px;">{{uploadedNum}}</strong>条数据。</span>
      </div>
    </div>
    <el-button type="primary" @click="toDetailList" round v-if="resultFlag">查看处理数据</el-button>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: "uploadScore",
  data(){
    return {
      visible: false, //上传弹框
      unUploadVisible: false, //未上传名单弹框
      uploadedNum: 0, //上传成功个数
      unUpload: '', //未上传人员字符串
      uploadMkey: '', //上传完成后缓存的mkey
      taskId:'',
      info: {
        taskName: '',
        taskDescription: '',
        originAdd:''
      },
      active: 0,
      resultFlag: false
    }
  },
  methods: {
    // 返回上一页
    back: function () {
      // this.$router.go(-1);
      this.$router.push('/excelView')
    },
    ...mapActions([
      'uploadScore'
    ]),
    beforeUpload(file) {
      const loading = this.$loading({
        lock: true,
        text: '数据处理中,请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let formData = new FormData();
      formData.append('file',file);
      formData.append('info', new Blob([JSON.stringify(this.info)], {type: "application/json"}));
      this.visible = false;
      this.uploadScore(formData).then(res=>{
        if (res.code === 200) {
          loading.close();
          this.resultFlag = true;
          this.uploadedNum = res.data.count;
          this.taskId = res.data.taskId;
          this.$message.success("导入成功")
        } else {
          loading.close();
          this.$message.error(res.data.message);
        }
      }).catch(err=>{
        loading.close();
        this.$message.error(err.message)
      })
      return false;
    },
    // 跳转到名单列表
    toDetailList() {
      this.$router.push({
        name: 'excelView',
        query: {
          taskId: this.taskId
        }
      })
    },
  },
  computed: {
    uploadInfo(){
      return new Blob([JSON.stringify(this.info)], {type: "application/json"});
    }
  }
}
</script>

<style lang="stylus" scoped>
.upload {
  text-align: center;
}
.add-steps {
  margin-top: 20px;
  height: 740px;
  background: #FFFFFF;
  box-shadow: 0 2px 8px 4px rgba(0,0,0,0.03);
  border-radius: 8px;
  .steps-container {
    height: 125px;
    box-sizing: border-box;
    border-bottom: 1px solid #EEEEF2;
    padding: 12px;
    margin: 0 24px;
    .steps-wrapper {
      margin-top: 25px;
    }
    .step-one {
      width: 32px;
      height: 32px;
    }
    .step-two {
      width: 32px;
      height: 32px;
    }
    .step-two-img {
      width: 32px;
      height: 32px;
    }
    .step-three {
      width: 32px;
      height: 32px;
    }
    .step-three-img {
      width: 32px;
      height: 32px;
    }
  }
  .steps-form-todo {
    margin: 0 150px;
    .form-upload {
      position: relative;
      height: 297px;
      .upload-wrapper {
        position: absolute;
        left: 50%;
        margin-left: -180px;
      }
      .upload-result {
        border: 1px solid #E1E4E8;
        border-radius: 4px;
        padding: 20px;
        box-sizing: border-box;
        max-height: 297px;
        overflow: auto;
        .result-success {
          font-weight: bold;
          img {
            vertical-align: middle;
            position: relative;
            top: -2px;
          }
        }
        .result-no-success {
          margin-top: 16px;
          font-size: 14px;
          color: #262626;
        }
      }
    }
    .form-button {
      padding-top: 60px;
      text-align: center;
    }
    //.form-button-next {
    //  padding-top: 300px;
    //}
  }
}
</style>
<style scoped>
.steps-form-todo /deep/ .el-form-item {
  margin-bottom: 16px;
}
.steps-form-todo /deep/ .el-form--label-top .el-form-item__label {
  padding: 0;
  line-height: 1.5;
}
.steps-container /deep/ .el-step__title.is-process {
  font-size: 16px;
  color: #336CE6;
}
.steps-container /deep/ .el-step__head.is-success {
  font-size: 16px;
  color: #15A575;
}
.steps-container /deep/ .el-step__head.is-success .el-step__icon-inner::before {
  content: url();
}
.steps-container /deep/ .el-step__title.is-success {
  color: #15A575;
  font-weight: bold;
}
</style>
