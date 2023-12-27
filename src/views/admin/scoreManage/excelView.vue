<template>
  <div>
    <el-form v-model="queryParams" ref="queryForm" size="small" :inline="true" @submit.native.prevent>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model.trim="queryParams.name"
          placeholder="请输入姓名"
          clearable
          style="width:240px"
          @keyup.enter.native="handleQuery"
          clearable @clear="handleQuery(queryParams)"
        ></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="number">
        <el-input
          v-model.trim="queryParams.number"
          placeholder="请输入学号"
          clearable
          style="width:240px"
          @keyup.enter.native="handleQuery"
          clearable @clear="handleQuery(queryParams)"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload-demo"
          :action="'http://localhost:8090/blog/score-manage/upload-score'"
          multiple
          name="file"
          :limit="1"
          :auto-upload="true"
          :on-success="handleSuccess"
          :file-list="fileList">
          <el-button size="mini" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  size="mini" @click="downLoad">导出报告</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="number"
        label="学号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="testNum"
        label="考号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="lesson"
        label="行政班级">
      </el-table-column>
      <el-table-column
        prop="school"
        label="学校">
      </el-table-column>
      <el-table-column
        prop="type"
        label="考生类型">
      </el-table-column>
      <el-table-column
        prop="score"
        label="分数">
      </el-table-column>
      <el-table-column
        prop="level"
        label="等级">
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 15]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>


<script>
import {mapActions} from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      name: "",
      number: "",
      dialogFormVisible: false,
      multipleSelection: [],
      headerBg: "headerBg",
      //form表单查询的数据
      queryParams: {
        name: '',
        number: '',
      },
      listData: [],
      fileList: []

    }
  },
  created() {
    this.handleQuery()
  },
  methods: {
    ...mapActions([
      'uploadScore',
      'pageScore'
    ]),
//搜索按钮
    handleQuery() {
      this.pageScore({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.queryParams.name,
        number: this.queryParams.number,
      }).then(res => {
        console.log("table数据："+res)
          this.tableData = res.records
          this.total = res.total
        })
        .catch(()=> {
          this.addressList = []
        })
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.handleQuery()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.handleQuery()
    },
    //重置按钮
    resetQuery () {
     //清空搜索栏
      this.queryParams = {
        name: '',
        number: '',
      }
      this.handleQuery()
    },

    handleSuccess() {
      this.$message.success("导入成功")
      this.handleQuery()
    },
    downLoad() {  //导出excel文件
      window.open('http://127.0.0.1:8090/blog/score-manage/export-data')
      this.$message.success("导出成功");
    },

    doExport() {
      this.toInterface("http://localhost:8090/blog/score-manage/export-data")
    },

    toInterface(url) {
      let mergeOptions = {
        url: url,
        method: "post",
        headers: {
          Accept: "*",
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8;",
        },
        responseType: "blob",
      };
      mergeOptions.paramType = "body";
      mergeOptions.headers["Content-Type"] =
        "application/json; charset=UTF-8";
      axios(mergeOptions)
        .then(function(response) {
          console.log(response)
          var blob = new Blob([response.data], {
            type: "application/vnd.ms-excel"
          });
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          var link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", "学生信息.xls");
          document.body.appendChild(link);
          link.click(); //点击下载

          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放掉blob对象
        })
        .catch(function(error) {
          console.error(error);
        });
    },
      exportExcel() {
      const apiUrl = 'http://localhost:8090/blog/score-manage/export-data';
      axios({
        baseURL: '',
        url: apiUrl,
        method: 'get',
        responseType: 'blob',
      }).then(res => {
        const filename = res.headers['content-disposition'].split('filename=')[1];
        const blob = new Blob([res.data], { type: 'application/octet-stream' });
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(objectUrl);
      });
    }

  }
}
</script>
