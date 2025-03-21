<template>
  <div class="permission-manage">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <h3>角色列表</h3>
          <el-table
            :data="roleList"
            style="width: 100%"
            @row-click="handleRoleClick"
            highlight-current-row
          >
            <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <h3>菜单权限</h3>
          <el-table
            :data="menuList"
            row-key="id"
            border
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column prop="name" label="菜单名称" width="200" align="center"></el-table-column>
            <el-table-column prop="url" label="菜单地址" width="300" align="center"></el-table-column>
            <el-table-column label="权限" width="100" align="center">
<!--              <template #default="{ row }">
                <el-checkbox v-model="row.selected" @change="handlePermissionChange(row)"></el-checkbox>
              </template>-->
            </el-table-column>
          </el-table>
          <el-button type="primary" style="margin-top: 20px" @click="savePermissions">保存权限</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>


import {mapActions} from "vuex";

export default {
  name: 'permissionManage',
  data() {
    return {
      roleList: [],
      menuList: [],
      selectedRoleId: null,
      selectedMenuIds: []
    }
  },
  created() {
    this.loadRoles()
  },
  methods: {
    ...mapActions([
      'listAllRole',
      'getMenusByRoleId',
    ]),
    async loadRoles(){
      this.listAllRole().then(res => {
        this.roleList = res
      })
        .catch(() => {
          this.roleList = []
        })
    },
    async handleRoleClick(row) {
      this.selectedRoleId = row.id
      this.getMenusByRoleId(row.id).then(res=>{
        this.menuList = res;
        this.updateSelectedMenuIds()
      })
    },
    handlePermissionChange(row) {
      this.updateSelectedMenuIds()
    },
    updateSelectedMenuIds() {
      this.selectedMenuIds = []
      const collectSelected = (menus) => {
        menus.forEach(menu => {
          if (menu.selected) {
            this.selectedMenuIds.push(menu.id)
          }
          if (menu.children && menu.children.length > 0) {
            collectSelected(menu.children)
          }
        })
      }
      collectSelected(this.menuList)
    },
    async savePermissions() {
      if (!this.selectedRoleId) {
        this.$message.warning('请先选择一个角色')
        return
      }
      const response = await request.post('/api/permission/save', {
        roleId: this.selectedRoleId,
        menuIds: this.selectedMenuIds
      })
      if (response.data.code === 200) {
        this.$message.success('权限保存成功')
        this.handleRoleClick({ id: this.selectedRoleId }) // 刷新菜单
      }
    }
  }
}
</script>

<style scoped>
.permission-manage {
  padding: 20px;
}
</style>
