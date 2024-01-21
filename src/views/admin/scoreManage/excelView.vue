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
      <el-select v-model="queryParams.lesson" clearable placeholder="请选择班级" size="small" @change="selectChange($event)">
        <el-option
          v-for="item in lessonList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleDelete">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload-demo"
          :action="'http://127.0.0.1:8090/blog/score-manage/upload-score'"
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
        <el-button type="primary" size="mini" @click.native="downLoad">导出报告</el-button>
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
import downLoadFile from "../../../util/fileutil";

export default {
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      name: "",
      number: "",
      lesson: '',
      dialogFormVisible: false,
      multipleSelection: [],
      //form表单查询的数据
      headerBg: "headerBg",
      queryParams: {
        name: '',
        number: '',
        lesson:''
      },
      listData: [],
      fileList: [],
      lessonList:[]
    }
  },
  created() {
    this.handleQuery();
    this.getLesson()
  },
  methods: {
    ...mapActions([
      'uploadScore',
      'pageScore',
      'listLesson',
      'deleteScore'
    ]),
//搜索按钮
    handleQuery() {
      this.pageScore({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.queryParams.name,
        number: this.queryParams.number,
        lesson: this.queryParams.lesson,
      }).then(res => {
        console.log("table数据：" + res)
        this.tableData = res.records
        this.total = res.total
      })
        .catch(() => {
          this.addressList = []
        })
    },
    // 删除
    handleDelete() {
      this.deleteScore({
        name: this.queryParams.name,
        number: this.queryParams.number,
        lesson: this.queryParams.lesson,
      }).then(res => {
        this.tableData = res.records
        this.total = res.total
      })
        .catch(() => {
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
    resetQuery() {
      //清空搜索栏
      this.queryParams = {
        name: '',
        number: '',
        lesson: '',
      }
      this.handleQuery()
    },

    handleSuccess() {
      this.$message.success("导入成功")
      this.handleQuery()
    },
   downLoad() {
      //导出excel文件
     if (this.lesson === "") {
       this.$message.error('请选择要导出的班级')
       return
     }
      window.open('http://127.0.0.1:8090/blog/score-manage/export-data/'+this.lesson);
      this.$message.success("导出成功");
    },
    getLesson(){
      this.listLesson().then(res => {
        this.lessonList = res
      })
        .catch(() => {
          this.lessonList = []
        })
    },
    selectChange(value){
      this.lesson = value;
    }
  }
}
</script>
