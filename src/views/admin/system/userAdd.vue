<template>
  <div>
  <el-form :model="userForm" status-icon  ref="userForm" label-width="100px" class="demo-userForm">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="userForm.userName"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="userForm.password"></el-input>
    </el-form-item>
    <el-form-item label="角色">
      <el-select v-model="userForm.roleId" multiple placeholder="请选择角色">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('userForm')">提交</el-button>
      <el-button @click="resetForm('userForm')">重置</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "userAdd",
  data() {
    return {
      userForm: {
        userName: '',
        password: '',
        roleId: '',
        checkPass: ''
      },
      roleList : [],
    };
  },
  created() {
    this.getAllRole()
  },
  methods: {
    ...mapActions([
      'listAllRole',
      'registerUser',
    ]),
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.save();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    save() {
      let params = {
        userName: this.userForm.userName,
        password: this.userForm.password,
        roleId: this.userForm.roleId,
      }
      this.registerUser(params)
        .then((data) => {
          this.$toast(data)
          this.$router.push({
            name: 'userList',
          })
        })
        .catch((err) => {
          this.$toast(err.msg, 'error')
        })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getAllRole(){
      this.listAllRole().then(res => {
        this.roleList = res
      })
        .catch(() => {
          this.roleList = []
        })
    },
  }
}
</script>

<style scoped>

</style>
