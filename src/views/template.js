`<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="默认">
        <el-input v-model="params.defalut" placeholder="默认"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="{{query}}()">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="createAndexport">
      <el-button type="primary" @click="openDialog(false)">创建</el-button>
      <el-button @click="exportExcel">下载excel</el-button>
    </div>
    <el-table :data="list" style="width: 100%" :border="true">
      <el-table-column
        prop="date"
        label="日期"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column label="操作" header-align="center" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            @click="openDialog(row)"
            style="margin-right:10px"
            >编辑</el-button
          >
          <el-popover placement="top" width="160" v-model="visible">
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false"
                >取消</el-button
              >
              <el-button type="primary" size="mini" @click="closeDelDialog(row)"
                >确定</el-button
              >
            </div>
            <el-button slot="reference" type="danger">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog
      :title="isCreate ? '创建' : '编辑'"
      :visible.sync="dialog"
      width="30%"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="默认" prop="defaultName">
          <el-input v-model="form.defalutName"></el-input>
        </el-form-item>
        <el-form-item align="center">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确定</el-button
          >
          <el-button @click="cancelSubmit('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { {{query}}, {{create}}, {{del}}, {{update}} } from "@/server";
export default {
  data() {
    return {
      params: {
        currentPage: 1,
        size: 10
      },
      form: {},
      list: [],
      total: 0,
      dialog: false,
      visible: false,
      isCreate: true,
      rules: {}
    };
  },
  created() {
    this.{{query}}();
  },
  methods: {
    async {{query}}() {
      const [error, data] = await {{query}}(this.params);
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    },
    async {{create}}() {
      const [error, data] = await {{create}}(this.form);
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    },
    async {{del}}({ id }) {
      const [error, data] = await {{del}}({ id });
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    },
    async {{update}}() {
      const [error, data] = await {{update}}(this.form);
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    },
    reset() {
      this.params = this.$options.data().params;
      this.{{query}}();
    },
    openDialog(row) {
      if (row) {
        this.form = { ...row };
        this.isCreate = false;
      } else {
        this.form = this.$options.data().form;
        this.isCreate = true;
      }
      this.dialog = true;
    },
    closeDelDialog(row) {
      this.visible = false;
      this.{{del}}(row);
    },
    handleSizeChange(value) {
      this.params.size = value;
      this.{{query}}();
    },
    handleCurrentChange(value) {
      this.params.currentPage = value;
      this.{{query}}();
    },
    exportExcel() {},
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.{{create}}();
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
.createAndexport,
.pagination {
  display: flex;
  justify-content: flex-end;
  margin: 15px 0;
}
</style>`;
