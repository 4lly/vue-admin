<template>
  <div>
    <el-form :inline="true" :model="form">
      <el-form-item label="角色名：">
        <el-input
          v-model="params.roleName"
          placeholder="请输入角色名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="roleQuery">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="indexCreateAndexport">
      <el-button
        type="primary"
        @click="openDialog(false)"
        v-permission="'role.create'"
        >创建</el-button
      >
    </div>
    <el-table :data="list" style="width: 100%" :border="true">
      <el-table-column
        prop="roleName"
        label="角色名"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column label="操作" header-align="center" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            @click="openDialog(row)"
            v-permission="'role.update'"
            style="margin-right: 10px"
            >编辑</el-button
          >
          <template>
            <el-popconfirm title="确定删除该角色吗?" @onConfirm="roleDel(row)">
              <el-button
                slot="reference"
                type="danger"
                v-permission="'role.del'"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="isCreate ? '创建' : '编辑'"
      :visible.sync="dialog"
      width="60%"
    >
      <el-form
        :inline="true"
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名" prop="roleName" style="width: 100%">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="菜单" prop="menuIds" style="width: 45%">
          <el-tree
            :data="menus"
            show-checkbox
            node-key="menuId"
            ref="menuTree"
            :props="defaultProps"
          >
          </el-tree>
        </el-form-item>
        <el-form-item label="权限" prop="permissionIds" style="width: 45%">
          <el-tree
            :data="permissions"
            show-checkbox
            node-key="menuId"
            ref="permissionTree"
            :props="defaultProps"
          >
          </el-tree>
        </el-form-item>
        <el-form-item align="center" style="width: 100%">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确定</el-button
          >
          <el-button @click="cancelSubmit('ruleForm')" style="margin-left: 20px"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { roleCreate, roleDel, roleUpdate, roleQuery } from "@/server/user/role";
import { queryMenu } from "@/server/user/menu";
import { permissionQuery } from "@/server/user/permission";
export default {
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10,
        roleName: ""
      },
      form: {
        roleName: "",
        menuIds: [],
        permissionIds: []
      },
      defaultProps: {
        children: "children",
        label: "menuName"
      },
      list: [],
      total: 0,
      dialog: false,
      visible: false,
      isCreate: true,
      rules: {
        roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }]
      },
      permissions: [],
      menus: []
    };
  },
  created() {
    this.roleQuery();
    this.queryMenu();
    this.permissionQuery();
  },
  methods: {
    async queryMenu() {
      const [error, data] = await queryMenu();
      if (error) {
        console.log(error);
      } else {
        this.menus = data.data;
      }
    },
    async permissionQuery() {
      const [error, data] = await permissionQuery();
      if (error) {
        console.log(error);
      } else {
        this.permissions = data.data;
      }
    },
    async roleQuery() {
      const [error, data] = await roleQuery(this.params);
      if (error) {
        console.log(error);
      } else {
        this.list = data.data.list;
        this.total = data.data.count;
      }
    },
    async roleCreate() {
      const [error, data] = await roleCreate(this.form);
      if (error) {
        console.log(error);
      } else {
        this.$message.success(data.data.message);
        this.dialog = false;
        this.roleQuery();
        console.log(data);
      }
    },
    async roleDel({ _id }) {
      const [error, data] = await roleDel({ _id });
      if (error) {
        console.log(error);
      } else {
        this.$message.success(data.data.message);
        this.roleQuery();
      }
    },
    async roleUpdate() {
      const [error, data] = await roleUpdate(this.form);
      if (error) {
        console.log(error);
      } else {
        this.$message.success(data.data.message);
        this.dialog = false;
        this.roleQuery();
      }
    },
    reset() {
      this.params = this.$options.data().params;
      this.roleQuery();
    },
    openDialog(row) {
      if (row) {
        this.form = { ...row };
        this.isCreate = false;
      } else {
        this.form = this.$options.data().form;
        this.isCreate = true;
      }
      row.menuIds = this.filtersKeys(row.menuIds);
      this.setKeys(row);
      this.dialog = true;
    },
    filtersKeys(menuIds) {
      return menuIds.filter(id => {
        return this.findElementIsHasChild(this.menus, id);
      });
    },
    findElementIsHasChild(data, id) {
      const { length } = data;
      for (let i = 0; i < length; i++) {
        const item = data[i];
        if (item.menuId === id) {
          if (item.children) {
            return false;
          } else {
            console.log(id);
            return true;
          }
        } else if (item.children && item.children.length) {
          const result = this.findElementIsHasChild(item.children, id);
          if (result) {
            return result;
          } else {
            continue;
          }
        }
      }
    },
    setKeys(data) {
      this.setMenusKeys(data);
      this.setPermissionKeys(data);
    },
    closeDelDialog(row) {
      this.visible = false;
      this.roleQuery(row);
    },
    handleSizeChange(value) {
      this.params.pageSize = value;
      this.roleQuery();
    },
    handleCurrentChange(value) {
      this.params.pageNum = value;
      this.roleQuery();
    },
    getMenusKeys() {
      this.form.menuIds = this.$refs.menuTree
        .getCheckedNodes(false, true)
        .map(item => item.menuId);
    },
    getPermissionKeys() {
      this.form.permissionIds = this.$refs.permissionTree.getCheckedKeys(true);
    },
    setMenusKeys(data = {}) {
      this.$nextTick(() => {
        this.form.menuIds = this.$refs.menuTree.setCheckedKeys(
          data.menuIds || []
        );
      });
    },
    setPermissionKeys(data = {}) {
      this.$nextTick(() => {
        this.form.permissionIds = this.$refs.permissionTree.setCheckedKeys(
          data.permissionIds || []
        );
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.getMenusKeys();
          this.getPermissionKeys();
          if (this.isCreate) {
            this.roleCreate();
          } else {
            this.roleUpdate();
          }
        }
      });
    },
    cancelSubmit(formName) {
      this.$refs[formName].resetFields();
      this.dialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.indexCreateAndexport,
.pagination {
  display: flex;
  justify-content: flex-end;
  margin: 15px 0;
}
</style>
