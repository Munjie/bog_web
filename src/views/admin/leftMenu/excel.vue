<template>
  <div class="add-default">
    <Title title="新增任务" style="background: #fff;margin: 0;">
      <el-button size="small" @click="back">返回</el-button>
    </Title>
    <div class="add-steps">
      <div class="steps-container">
        <el-steps :active="active" align-center class="steps-wrapper" finish-status="success">
          <el-step title="1.填写" icon="el-icon-edit" >
            <i class="step-one" slot="icon"></i>
          </el-step>
          <el-step title="2.上传" icon="el-icon-upload">
            <i class="step-two" slot="icon" :class="active===1?'step-two-img':''"></i>
          </el-step>
        </el-steps>
      </div>
      <div class="steps-form-todo">
        <el-form :model="info" ref="ruleForm" label-width="120px" :rules="rules" label-position="top">
          <div class="grid-content" style="margin:50px;" v-if="active === 0">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="taskName" label="任务名称">
                  <el-input v-model="info.taskName" :maxlength="100" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item prop="taskName" label="收件人邮箱">
                  <el-input v-model="info.email" :maxlength="100" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="form-upload" v-if="active === 1" style="margin: 50px">
            <el-upload
              v-show="!resultFlag"
              ref="upload"
              class="upload-wrapper"
              drag
              :action="'http://localhost:8088/blog/task/createTask'"
              :with-credentials="true"
              :multiple="false"
              :data="{info:uploadInfo}"
              accept=".xls,.xlsx"
              :before-upload="beforeUpload">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">第一行为表头内容为:始发城市|到货邮编|到货省份|到货城市|到货区县,第二行为内容开始</div>
            </el-upload>
            <div class="upload-result" v-show="resultFlag">
              <div class="result-success">
                <img src="/../../../assets/images/icon_chengg.png" alt="">
                <span>成功导入了<strong style="font-size: 20px;">{{uploadedNum}}</strong>条数据。</span>
              </div>
            </div>
          </div>
        </el-form>
        <div style="text-align: center" class="form-button">
          <el-button type="primary" @click="next" round v-if="active < 1">下一步</el-button>
          <el-button type="primary" @click="pre" round v-if="active >0 && !resultFlag">上一步</el-button>
          <el-button type="primary" @click="toDetailList" round v-if="resultFlag">查看处理数据</el-button>
          <el-button type="primary" @click="$router.go(-1)" round v-if="resultFlag">返回任务列表</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="unUploadVisible" :close-on-click-modal="false" :close-on-press-escape='false' width="600px">
      <div>
        <p>成功导入了<strong style="font-size: 20px;">{{uploadedNum}}</strong>条数据。</p>
        <p v-if="unUpload">
          <strong>数据不存在：</strong>
          <span style="display: inline-block; word-break: break-all;">{{unUpload}}</span>
        </p>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" @click="toDetailList" style="margin-right: 30px;">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: "excel",
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
        email: '',
      },
      rules: {
        taskName: [
          {required: true, message: '请填写任务名称', trigger: 'blur'}
        ],
      },
      active: 0,
      resultFlag: false
    }
  },
  methods: {
    // 返回上一页
    back: function () {
      // this.$router.go(-1);
      this.$router.push('/taskList')
    },
    ...mapActions([
      'uploadExcel'
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
      this.uploadExcel(formData).then(res=>{
        if (res.code === 200) {
          loading.close();
          this.resultFlag = true;
          this.uploadedNum = res.data;
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
        name: 'addressList',
        query: {
          taskId: this.taskId
        }
      })
    },
    /* 下一步 */
    next() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // this.visible = true;
          if (this.active++ > 2) this.active = 0;
        } else {
          return false;
        }
      })
    },
    /* 上一步 */
    pre() {
      if (this.active-- < 2) this.active = 0;
    }

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
