<template>
  <div class="app-container">
    <div class="button-container">
      <el-button type="success" icon="el-icon-edit" @click="handleAdd()">新增角色</el-button>
    </div>
    <el-table v-loading="loading" :data="roleList">
      <el-table-column type="selection"  align="center" />
      <el-table-column label="角色编号" prop="id" align="center"/>
      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true"  align="center"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-tree
            ref="menu"
            :data="menuTree"
            show-checkbox
            node-key="id"
            :default-checked-keys="checkedMenuIds"
            :props="{ label: 'name', children: 'children' }"
            default-expand-all
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveRole">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {mapActions} from "vuex";

export default {
  name: "roleManage",
  data() {
    return {
      menuTree: [],
      dialogVisible: false,
      selectedRoleId: null,
      checkedMenuIds: [] ,// 存储已选中的菜单ID
      currentRoleName: '', // 存储当前角色名称
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 数据范围选项
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getAllRole();
  },
  methods: {
    ...mapActions([
      'listAllRole',
      'getMenusByRoleId',
      'savePermissions',
      'deleteRole',
    ]),
    /** 查询角色列表 */
    getAllRole(){
      this.loading = true;
      this.listAllRole().then(res => {
        this.roleList = res
        this.loading = false;
      })
        .catch(() => {
          this.roleList = []
        })
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.roleName + '"角色吗？').then(function() {
        return changeRoleStatus(row.roleId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.menuExpand = false,
      this.menuNodeAll = false,
      this.deptExpand = true,
      this.deptNodeAll = false,
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: "0",
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: undefined
      };
      this.resetForm("form");
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuTree;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuTree: []);
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      const roleId = 9999
      this.getMenusByRoleId(roleId).then(res=>{
        this.open = true;
        this.menuTree = res;
        // 设置默认选中的菜单
        this.checkedMenuIds = this.getCheckedMenuIds(this.menuTree)
      })
      this.title = "添加角色";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const roleId = row.id || this.ids
      this.getMenusByRoleId(roleId).then(res=>{
        this.open = true;
        this.menuTree = res;
        // 设置默认选中的菜单
        this.checkedMenuIds = this.getCheckedMenuIds(this.menuTree)
        this.form.roleName  = row.roleName
        this.selectedRoleId = roleId
      })
      this.title = "修改角色";
    },
     /*保存*/
    async saveRole() {
      const checkedIds = this.$refs.menu.getCheckedKeys()
      let params = {
        roleId: this.selectedRoleId,
        roleName: this.form.roleName,
        menuIds: checkedIds
      }
      this.savePermissions(params)
        .then((data) => {
          this.$toast(data.message)
          this.open = false;
          this.getAllRole();
        })
        .catch((err) => {
          this.$toast(err.message, 'error')
        })
    },
    getCheckedMenuIds(menus) {
      const checkedIds = []
      const collectChecked = (nodes) => {
        nodes.forEach(node => {
          if (node.selected) {
            checkedIds.push(node.id)
          }
          if (node.children && node.children.length > 0) {
            collectChecked(node.children)
          }
        })
      }
      collectChecked(menus)
      return checkedIds
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.roleId != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            updateRole(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            addRole(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.deleteRole(id).then((data) => {
        this.$toast('已删除')
        this.getAllRole()
      })
        .catch((err)=> {
          this.$toast(err.msg, 'error')
        })
    },
  }
};
</script>
<style lang="stylus" scoped>

.button-container {
  display: flex;
  justify-content: flex-end; /* 让子元素靠右对齐 */
}

</style>
