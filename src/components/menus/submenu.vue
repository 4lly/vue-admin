<template>
  <div>
    <el-submenu :index="child.path">
      <template slot="title">{{ child.menuName }}</template>
      <template>
        <div v-for="(item, index) in child.children" :key="index">
          <el-menu-item v-if="!item.children" :index="item.path">
            {{ item.menuName }}
          </el-menu-item>
          <submenu :child="item" v-else />
        </div>
      </template>
    </el-submenu>
  </div>
</template>
<script>
export default {
  name: "submenu",
  props: {
    child: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped></style>
