<template>
  <div class="login">
    <div class="content">
      <h4>自定义后台系统</h4>
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户账号" prop="userAccount">
          <el-input
            v-model="form.userAccount"
            placeholder="请输入用户账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            style="width: 100%"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "@/server/login";
// import md5 from "blueimp-md5";
import { setSession } from "@/utils/cache";
export default {
  data() {
    return {
      form: {
        userAccount: "",
        password: ""
      },
      rules: {
        userAccount: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    async login() {
      const params = this.setParams();
      const [error, data] = await login(params);
      if (error) {
        console.log(error);
      } else {
        const { userInfo, token } = data.data;
        setSession.token = token;
        setSession.user = userInfo;
        this.$store.commit("setUser", userInfo);
        this.$router.push({
          path: "/user/index"
        });
      }
    },
    setParams() {
      const params = { ...this.form };
      // params.password = md5(params.password);
      return params;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        valid && this.login();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login,
.content,
h4 {
  display: flex;
  align-items: center;
  justify-content: center;
}
.login {
  width: 100vw;
  height: 100vh;
  .content {
    flex-wrap: wrap;
    h4 {
      width: 100%;
      padding-left: 74px;
      margin-bottom: 20px;
    }
  }
}
</style>
