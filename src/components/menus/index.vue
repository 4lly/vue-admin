<template>
  <div class="menus">
    <el-menu
      style="height:100%"
      :unique-opened="true"
      :default-active="$route.path"
      :router="true"
    >
      <div v-for="(item, index) in menus" :key="index">
        <div v-if="item.children">
          <submenu :child="item" />
        </div>
        <el-menu-item v-else :index="item.path">
          <span slot="title">{{ item.menuName }}</span>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
import submenu from "./submenu.vue";
export default {
  name: "menus",
  components: { submenu },
  props: {
    menus: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.menus {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}
</style>
