<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-form :model="params" label-position="left" :inline="true">
          <el-form-item label="名字：">
            <el-input
              v-model="params.name"
              placeholder="请输入名字"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="班级：">
            <el-input
              v-model="params.class"
              placeholder="请输入班级"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="兴趣：">
            <el-input
              v-model="params.interest"
              placeholder="请输入兴趣"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="性别：">
            <el-radio-group v-model="params.gender">
              <el-radio label="0">女</el-radio>
              <el-radio label="1">男</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="margin-left:10px">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="margin:15px 20px 15px 0;text-align:right">
        <el-button
          @click="create()"
          type="primary"
          style="margin-right:10px"
          v-permission="'student.create'"
          >创建学生</el-button
        >
        <el-button @click="download()" v-permission="'student.download'"
          >下载</el-button
        >
      </el-col>
    </el-row>
    <el-table :data="userList" style="width: 100%" border>
      <el-table-column
        prop="name"
        label="姓名"
        align="center"
        header-align="center"
      ></el-table-column>
      <el-table-column
        prop="class"
        label="班级"
        align="center"
        header-align="center"
      ></el-table-column>
      <el-table-column
        prop="interest"
        label="兴趣"
        align="center"
        header-align="center"
      ></el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        align="center"
        header-align="center"
        :formatter="formatterGender"
      ></el-table-column>
      <el-table-column label="操作" align="center" header-align="center">
        <template slot-scope="{ row }">
          <el-button @click="openDialog(row)" v-permission="'student.update'"
            >编辑</el-button
          >
          <template>
            <el-popconfirm
              title="这是一段内容确定删除吗？"
              @onConfirm="deteleStudent(row)"
            >
              <el-button
                slot="reference"
                type="danger"
                style="margin-left:10px"
                v-permission="'student.del'"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination.
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="学生信息录入" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="class">
          <el-input v-model="form.class"></el-input>
        </el-form-item>
        <el-form-item label="兴趣" prop="interest">
          <el-input type="textarea" v-model="form.interest"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="0">女</el-radio>
            <el-radio label="1">男</el-radio>
          </el-radio-group>
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
  createStudent,
  updateStudent,
  deteleStudent,
  querStudent,
  donwloadStudentInfo,
} from "@/server/student";
import { defineComponent, inject } from "@vue/composition-api";
export default defineComponent({
  setup() {
    const router = inject("router");
    console.log(router);
  },
  data() {
    return {
      userList: [],
      isCreated: true,
      dialogVisible: false,
      form: {
        name: "",
        class: "",
        interest: "",
        gender: "",
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        class: "",
        interest: "",
        gender: "",
      },
      total: 0,
      rules: {
        name: [{ required: false, message: "请输入名字", trigger: "blur" }],
        class: [{ required: true, message: "请输入班级", trigger: "blur" }],
      },
    };
  },
  created() {
    this.querStudent();
  },
  methods: {
    formatterGender(row, column, cellValue) {
      const maps = {
        0: "女",
        1: "男",
      };
      return maps[cellValue];
    },
    onSubmit() {
      this.querStudent();
    },
    reset() {
      this.params = this.$options.data().params;
      this.querStudent();
    },
    handleSizeChange(value) {
      this.params.pageSize = value;
      this.querStudent();
    },
    handleCurrentChange(value) {
      this.params.pageNum = value;
      this.querStudent();
    },
    async deteleStudent({ _id }) {
      const [error] = await deteleStudent({ _id });
      if (error) {
        console.log(error);
      } else {
        this.querStudent();
      }
    },
    async updateStudent() {
      const [error] = await updateStudent(this.form);
      if (error) {
        console.log(error);
      } else {
        this.dialogVisible = false;
        this.querStudent();
      }
    },
    async createStudent() {
      const [error] = await createStudent(this.form);
      if (error) {
        console.log(error);
      } else {
        this.dialogVisible = false;
        this.querStudent();
      }
    },
    async querStudent() {
      const [error, data] = await querStudent(this.params);
      if (error) {
        console.log(error);
      } else {
        const { list, count } = data.data;
        this.userList = list;
        this.total = count;
      }
    },
    openDialog(row) {
      this.dialogVisible = true;
      this.isCreated = false;
      this.setForm(row);
    },
    create() {
      this.dialogVisible = true;
      this.isCreated = true;
      this.form = this.$options.data().form;
    },
    setForm(row) {
      const keys = ["name", "class", "interest", "gender"];
      keys.forEach((key) => {
        this.form[key] = row[key];
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.isCreated) {
            await this.createStudent();
          } else {
            await this.updateStudent();
          }
        }
      });
    },
    // 返回文件流下载 设置response blod
    createBlob1(data, fileName) {
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
    },
    // 返回buffer，设置response ArrayBuffer
    createBlob(data, fileName) {
      const blob = Buffer.from(data);
      const downloadElement = document.createElement("a");
      const href = URL.createObjectURL(new Blob([blob])); // 创建下载的链接
      downloadElement.href = href;
      downloadElement.download = fileName;
      document.body.appendChild(downloadElement);
      downloadElement.click(); // 点击下载
      document.body.removeChild(downloadElement); // 下载完成移除元素
      URL.revokeObjectURL(href); // 释放掉blob对象
    },
    async download() {
      const [error, data] = await donwloadStudentInfo(this.params);
      if (error) {
        console.log(error);
      } else {
        this.createBlob(data.data.data, "测试文件.xls");
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.pagination {
  margin: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
