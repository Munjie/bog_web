<template>
  <div class="menu-list">
    <el-button type="primary" @click="openAddDialog(null)">新增顶级菜单</el-button>
    <el-table
      :data="menuList"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      lazy
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="菜单名称" align="center"
                       header-align="center"></el-table-column>
      <el-table-column prop="url" label="菜单地址" align="center"
                       header-align="center"></el-table-column>
<!--      <el-table-column prop="icon" label="图标" width="200">
        <template #default="{ row }">
          <i :class="row.icon"></i>
          {{ row.icon }}
        </template>
      </el-table-column>-->
      <el-table-column prop="sort" label="排序" align="center"
                       header-align="center"></el-table-column>
      <el-table-column prop="pid" label="父菜单ID" align="center"
                       header-align="center"></el-table-column>
      <el-table-column label="操作" align="center"
                       header-align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="openAddDialog(scope.row)">添加子菜单</el-button>
          <el-button
            size="mini"
            @click="openEditDialog(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑菜单对话框 -->
      <el-dialog :title="dialogTitle" :visible.sync="open" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="父菜单">
          <el-select v-model="form.pid" placeholder="请选择父菜单" clearable>
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="menu in flatMenus"
              :key="menu.id"
              :label="menu.name"
              :value="menu.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单URL">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "menuList",
  data() {
    return {
      // 是否显示弹出层
      open: false,
      menuList: [],
      menuTree: [],
      flatMenus: [],
      dialogVisible: false,
      dialogTitle: '',
      form: {
        id: null,
        name: '',
        url: '',
        pid: 0,
        sort: 0,
        icon: ''
      }
    }
  },
  created() {
    this.loadMenuList()
  },
  methods: {
    ...mapActions([
      'listAllMenu',
      'deleteMenu',
      'saveMenu',
    ]),
    async loadMenuList(){
      this.listAllMenu().then(res => {
        this.menuList = res
      })
        .catch(() => {
          this.menuList = []
        })
    },
    openAddDialog(parent) {
      this.dialogTitle = '新增菜单'
      this.form = {
        id: null,
        name: '',
        url: '',
        pid: parent ? parent.id : 0,
        sort: 0,
        icon: ''
      }
      this.open = true;
    },
    cancel() {
      this.open = false;
    },
    async submitForm() {
      this.saveMenu(this.form)
        .then((data) => {
          this.$toast(data.message)
          this.open = false;
          this.loadMenuList();
        })
        .catch((err) => {
          this.$toast(err.message, 'error')
        })

    },
    openEditDialog(menu) {
      this.dialogTitle = '编辑菜单'
      this.form = {
        id: menu.id,
        name: menu.name,
        url: menu.url,
        pid: menu.pid || 0,
        sort: menu.sort,
        icon: menu.icon
      }
      this.open = true;
    },
    handleDelete(id) {
      this.deleteMenu(id).then((data) => {
        this.$toast(data.message)
        this.loadMenuList()
      })
        .catch((err)=> {
          this.$toast(err.msg, 'error')
        })
    }
  }
}
</script>

<style scoped>

</style>
