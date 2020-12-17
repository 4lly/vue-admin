<template>
  <div>
    <el-button
      @click="addMenu"
      type="primary"
      size="mini"
      v-permission="'menu.create'"
      >添加菜单</el-button
    >
    <el-tree
      :data="menus"
      node-key="id"
      empty-text="暂无菜单"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent"
    >
    </el-tree>
    <el-dialog title="菜单信息" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="菜单名" prop="menuName">
          <el-input v-model.trim="form.menuName" clearable></el-input>
        </el-form-item>
        <el-form-item label="页面路径" prop="path">
          <el-input v-model.trim="form.path" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属层级" prop="ids">
          <el-cascader
            clearable
            :options="menus"
            :show-all-levels="false"
            :props="customProps"
            v-model="form.ids"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="组件路径" prop="componentFilePath">
          <el-input v-model.trim="form.componentFilePath" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  createMenu,
  updateMenu,
  deteleMenu,
  queryMenu
} from "@/server/user/menu";
import { findParentElement } from "@/utils";
import { mapState } from "vuex";
export default {
  computed: mapState({
    menu: "menus"
  }),
  data() {
    return {
      menus: [],
      isCreated: true,
      dialogVisible: false,
      customProps: {
        label: "menuName",
        value: "menuId",
        checkStrictly: true
      },
      form: {
        menuName: "",
        menuId: "",
        path: "",
        ids: [],
        componentFilePath: ""
      },
      rules: {
        menuName: [
          { required: true, message: "请输入菜单名", trigger: "blur" }
        ],
        path: [{ required: true, message: "请输入路径", trigger: "blur" }],
        componentFilePath: [
          { required: true, message: "请输入组件路径", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.queryMenu();
  },
  methods: {
    onSubmit() {
      this.queryMenu();
    },
    handleSizeChange(value) {
      this.params.pageSize = value;
      this.queryMenu();
    },
    async deteleMenu({ _id }) {
      const [error, data] = await deteleMenu({ _id });
      if (error) {
        console.log(error);
      } else {
        this.$message.success(data.data.message);
        this.queryMenu();
      }
    },
    async updateMenu() {
      const params = this.setParams();
      const [error, data] = await updateMenu(params);
      if (error) {
        console.log(error);
      } else {
        this.dialogVisible = false;
        this.queryMenu();
        this.$message.success(data.data.message);
      }
    },
    setParams() {
      let params = {
        ...this.form
      };
      const { ids } = params;
      const { length } = ids;
      if (this.isCreated) {
        params.parentId = ids[length - 1];
      } else {
        if (ids[length - 1] === params.menuId) {
          params.parentId = ids[length - 2];
        } else {
          params.parentId = ids[length - 1];
        }
      }
      return params;
    },
    async createMenu() {
      const params = this.setParams();
      const [error, data] = await createMenu(params);
      if (error) {
        console.log(error);
      } else {
        this.dialogVisible = false;
        this.queryMenu();
        this.$message.success(data.data.message);
      }
    },
    async queryMenu() {
      const [error, data] = await queryMenu();
      if (error) {
        console.log(error);
      } else {
        this.menus = data.data;
      }
    },
    openDialog(data) {
      this.dialogVisible = true;
      this.isCreated = false;
      this.setForm(data);
    },
    setForm(data) {
      this.form = { ...data };
      const parentIds = findParentElement(
        this.menu,
        data.parentId,
        this.menu
      ).map(item => item.menuId);
      this.form.ids = [...parentIds, data.menuId];
    },
    addMenu() {
      this.dialogVisible = true;
      this.isCreated = true;
      this.form = this.$options.data().form;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.isCreated) {
            await this.createMenu();
          } else {
            await this.updateMenu();
          }
        }
      });
    },
    open(data) {
      this.$confirm("此操作将删除该菜单，是否继续?", "删除确认框", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.deteleMenu(data);
      });
    },
    renderContent(h, { data }) {
      return (
        <span>
          <span style="font-size:12px;min-width:60px;display:inline-block;">
            {data.menuName}
          </span>
          <span>
            <el-button
              size="mini"
              type="text"
              v-permission="menu.update"
              on-click={() => this.openDialog(data)}
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              onClick={() => this.open(data)}
              v-permission="menu.del"
            >
              删除
            </el-button>
          </span>
        </span>
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.pagination {
  margin: 20px;
  display: flex;
  justify-content: flex-end;
}
.label {
  font-size: 12px;
}
</style>
