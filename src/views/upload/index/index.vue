<template>
  <div>
    <el-upload
      :http-request="customUpload"
      class="upload-demo"
      multiple
      action="#"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <img v-if="url" :src="url" alt style="width:300px" />
  </div>
</template>

<script>
import { upload } from "@/server/upload";
export default {
  data() {
    return {
      url: ""
    };
  },
  methods: {
    async customUpload(file) {
      const fromData = new FormData();
      fromData.append("file", file.file);
      const [error, data] = await upload(fromData);
      if (error) {
        console.log("error", error);
      } else {
        this.url = `${process.env.VUE_APP_API}public/${data.data.path}`;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
