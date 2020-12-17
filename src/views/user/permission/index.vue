<template>
  <div>
    <el-button
      @click="addMenu"
      type="primary"
      size="mini"
      v-permission="'permission.create'"
      >添加权限</el-button
    >
    <el-tree
      :data="permissions"
      node-key="id"
      default-expand-all
      empty-text="暂无权限"
      :expand-on-click-node="false"
      :render-content="renderContent"
    >
    </el-tree>
    <el-dialog title="权限信息" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="权限行为" prop="action">
          <el-input v-model.trim="form.action" clearable></el-input>
        </el-form-item>
        <el-form-item label="权限名" prop="permissionName">
          <el-input v-model.trim="form.permissionName" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属页面" prop="parentId">
          <el-cascader
            :options="permissions"
            :show-all-levels="false"
            :props="customProps"
            v-model="form.parentId"
          ></el-cascader>
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
  permissionCreate,
  permissionDel,
  permissionUpdate,
  permissionQuery
} from "@/server/user/permission";
import { findParentElement } from "@/utils";
export default {
  data() {
    return {
      permissions: [],
      isCreated: true,
      dialogVisible: false,
      customProps: {
        label: "menuName",
        value: "menuId",
        checkStrictly: true
      },
      form: {
        action: "",
        permissionName: "",
        parentId: []
      },
      rules: {
        action: [
          { required: true, message: "请输入权限行为", trigger: "blur" }
        ],
        permissionName: [
          { required: true, message: "请输入权限名", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "请选择所属页面", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.permissionQuery();
  },
  methods: {
    async permissionDel({ _id }) {
      const [error, data] = await permissionDel({ _id });
      if (error) {
        console.log(error);
      } else {
        this.$message.success(data.data.message);
        this.permissionQuery();
      }
    },
    async permissionUpdate() {
      const params = this.setParams();
      const [error, data] = await permissionUpdate(params);
      if (error) {
        console.log(error);
      } else {
        this.dialogVisible = false;
        this.permissionQuery();
        this.$message.success(data.data.message);
      }
    },
    setParams() {
      let params = {
        ...this.form
      };
      const { parentId } = params;
      const { length } = parentId;
      if (this.isCreated) {
        params.parentId = parentId[length - 1];
      } else {
        if (parentId[length - 1] === params.menuId) {
          params.parentId = parentId[length - 2];
        } else {
          params.parentId = parentId[length - 1];
        }
      }
      return params;
    },
    async permissionCreate() {
      const params = this.setParams();
      const [error, data] = await permissionCreate(params);
      if (error) {
        console.log(error);
      } else {
        this.dialogVisible = false;
        this.permissionQuery();
        this.$message.success(data.data.message);
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
    openDialog(data) {
      this.dialogVisible = true;
      this.isCreated = false;
      this.setForm(data);
    },
    setForm(data) {
      this.form = { ...data };
      const parentIds = findParentElement(
        this.permissions,
        data.parentId,
        this.permissions
      ).map(item => item.menuId);
      this.form.parentId = [...parentIds, data.menuId];
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
            await this.permissionCreate();
          } else {
            await this.permissionUpdate();
          }
        }
      });
    },
    open(data) {
      this.$confirm("此操作将删除该权限，是否继续?", "删除确认框", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.permissionDel(data);
      });
    },
    renderContent(h, { data }) {
      const isShow = data.permissionId ? true : false;
      let html;
      if (isShow) {
        html = (
          <span style="margin-left:10px">
            <el-button
              size="mini"
              type="text"
              v-permission="permission.update"
              on-click={() => this.openDialog(data)}
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              v-permission="permission.del"
              onClick={() => this.open(data)}
            >
              删除
            </el-button>
          </span>
        );
      }
      return (
        <span>
          <span style="font-size:12px;min-width:60px;display:inline-block;">
            {data.menuName}
            {html}
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
