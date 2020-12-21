<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-form :model="params" label-position="left" :inline="true">
          <el-form-item label="用户名：">
            <el-input
              v-model="params.userName"
              placeholder="请输入名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-left:10px">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="indexCreateAndexport">
      <el-button
        type="primary"
        @click="openDialog()"
        v-permission="'user.create'"
        >创建</el-button
      >
    </div>
    <el-table :data="userList" style="width: 100%" border>
      <el-table-column
        prop="userName"
        label="用户名"
        align="center"
        header-align="center"
      ></el-table-column>
      <el-table-column
        prop="userAccount"
        label="用户账号"
        align="center"
        header-align="center"
      ></el-table-column>
      <el-table-column
        prop="roleId"
        label="角色ID"
        align="center"
        header-align="center"
      ></el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间"
        align="center"
        header-align="center"
      ></el-table-column>
      <el-table-column
        prop="updateDate"
        label="更新时间"
        align="center"
        header-align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center" header-align="center">
        <template slot-scope="{ row }">
          <el-button @click="openDialog(row)" v-permission="'user.update'"
            >编辑</el-button
          >
          <template>
            <el-popconfirm
              title="这是一段内容确定删除吗？"
              @onConfirm="deteleUser(row)"
            >
              <el-button
                slot="reference"
                type="danger"
                style="margin-left:10px"
                v-permission="'user.del'"
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
      ></el-pagination>
    </div>
    <el-dialog title="用户信息" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="用户账号" prop="userAccount">
          <el-input v-model="form.userAccount"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="form.roleId" multiple placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            >
            </el-option>
          </el-select>
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
import { createUser, updateUser, deteleUser, queryUser } from "@/server/user";
import { roleQueryAll } from "@/server/user/role";
import md5 from "blueimp-md5";

export default {
  data() {
    return {
      userList: [],
      isCreated: true,
      dialogVisible: false,
      form: {
        userName: "",
        userAccount: "",
        password: "",
        roleId: []
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        userName: ""
      },
      total: 0,
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        userAccount: [
          { required: true, message: "请输入用户账号", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }]
      },
      roles: []
    };
  },
  created() {
    this.queryUser();
    this.roleQueryAll();
  },
  methods: {
    onSubmit() {
      this.queryUser();
    },
    reset() {
      this.params = this.$options.data().params;
      this.queryUser();
    },
    handleSizeChange(value) {
      this.params.pageSize = value;
      this.queryUser();
    },
    handleCurrentChange(value) {
      this.params.pageNum = value;
      this.queryUser();
    },
    async deteleUser({ _id }) {
      const [error, data] = await deteleUser({ _id });
      if (error) {
        console.log(error);
      } else {
        this.$message.success(data.data.message);
        this.queryUser();
      }
    },
    async updateUser() {
      const params = this.setParams();
      const [error, data] = await updateUser(params);
      if (error) {
        console.log(error);
      } else {
        this.dialogVisible = false;
        this.queryUser();
        this.$message.success(data.data.message);
      }
    },
    setParams() {
      const params = { ...this.form };
      params.password = md5(params.password);
      return params;
    },
    async createUser() {
      const params = this.setParams();
      const [error, data] = await createUser(params);
      if (error) {
        console.log(error);
      } else {
        this.dialogVisible = false;
        this.queryUser();
        this.$message.success(data.data.message);
      }
    },
    async queryUser() {
      const [error, data] = await queryUser(this.params);
      if (error) {
        console.log(error);
      } else {
        const { list, count } = data.data;
        this.userList = list;
        this.total = count;
      }
    },
    async roleQueryAll() {
      const [error, data] = await roleQueryAll();
      if (error) {
        console.log(error);
      } else {
        this.roles = data.data;
      }
    },
    openDialog(row) {
      if (row) {
        this.isCreated = false;
        this.setForm(row);
      } else {
        this.isCreated = true;
        this.form = this.$options.data().form;
      }
      this.dialogVisible = true;
    },
    create() {
      this.dialogVisible = true;
      this.isCreated = true;
      this.form = this.$options.data().form;
    },
    setForm(row) {
      const keys = ["userName", "userAccount", "roleId"];
      keys.forEach(key => {
        this.form[key] = row[key];
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.isCreated) {
            await this.createUser();
          } else {
            await this.updateUser();
          }
        }
      });
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
