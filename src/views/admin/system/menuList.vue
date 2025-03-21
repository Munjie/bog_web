<template>
  <div class="menu-list">
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
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "menuList",
  data() {
    return {
      menuList: []
    }
  },
  created() {
    this.loadMenuList()
  },
  methods: {
    ...mapActions([
      'listAllMenu',
    ]),
    async loadMenuList(){
      this.listAllMenu().then(res => {
        this.menuList = res
      })
        .catch(() => {
          this.menuList = []
        })
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
}
</script>

<style scoped>

</style>
