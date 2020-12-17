<template>
  <el-container>
    <el-aside width="180px">
      <custom-menus :menus="menus"></custom-menus>
    </el-aside>
    <el-main>
      <div class="header">
        <span class="name">当前用户：{{ user.userName }}</span>
        <el-button @click="logout">退出</el-button>
      </div>
      <div class="nav">
        <ul>
          <li
            v-for="(item, index) in navs"
            :key="item.path"
            :class="index === navs.length - 1 ? 'heightLight' : ''"
            @click="nav(index === navs.length - 1, item.path)"
          >
            {{ item.name
            }}<span class="line" v-if="index < navs.length - 1">/</span>
          </li>
        </ul>
      </div>
      <div class="place"></div>
      <router-view />
    </el-main>
    <el-backtop target=".el-main" :bottom="100"> </el-backtop>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
import { logout } from "@/server/login";
import { findParentElement } from "@/utils";
export default {
  computed: mapState(["menus", "user"]),
  watch: {
    "$route.path"() {
      this.setNavs();
    }
  },
  data() {
    return {
      navs: []
    };
  },
  created() {
    this.setNavs();
  },
  methods: {
    setNavs() {
      const result = this.findName(this.menus, this.$route.path);
      const parentElement = findParentElement(
        this.menus,
        result[0].parentId,
        this.menus
      );
      result.unshift(...parentElement);
      this.navs = result;
    },
    findName(data, path) {
      const result = [];
      const { length } = data;
      for (let i = 0; i < length; i++) {
        const item = data[i];
        if (item.path === path) {
          result.push({
            path: item.path,
            name: item.menuName,
            menuId: item.menuId,
            parentId: item.parentId
          });
        } else if (item.children && item.children.length) {
          result.push(...this.findName(item.children, path));
        }
      }
      return result;
    },
    nav(flag, path) {
      flag && this.$router.push({ path });
    },
    resetRoutesAndClearSession() {
      sessionStorage.clear();
      const menus = this.$router.options.routes.find(i => i.path === "/menu");
      menus.children = [];
      this.$router.addRoutes(this.$router.options.routes);
    },
    logout() {
      this.$confirm("确认退出系统吗?", "确认框", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const [error] = await logout();
        if (error) {
          console.log(error);
        } else {
          this.resetRoutesAndClearSession();
          this.$router.replace({
            path: "/"
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.el-aside {
  height: 100vh;
}
.el-main {
  padding: 10px 15px;
  box-sizing: border-box;
  height: 100vh;
  .nav {
    margin: 10px 0 10px 0x;
    border-bottom: 1px solid #e6e6e6;
  }
  .place {
    margin-bottom: 15px;
  }
  .header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .name {
      margin-right: 20px;
      font-family: "Helvetica Neue", Helvetica, "PingFang SC",
        "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #303133;
    }
  }
}
</style>
<style lang="scss" scoped>
ul {
  list-style-type: none;
  display: flex;
  font-size: 13px;
  color: #606266;
  li {
    .line {
      margin: 0 5px;
    }
  }
  .heightLight {
    color: #303133;
    font-weight: 700;
    cursor: pointer;
  }
}
</style>
