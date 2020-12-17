import axios from "axios";
import { Message } from "element-ui";
import { refreshToken } from "@/server/index.js";
import store from "@/store/index.js";
import { setSession } from "@/utils/cache";
axios.defaults.baseURL = process.env.VUE_APP_API;
const whiteUrl = ["/login", "/queryMenusAndPermission"];
// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    const { action, url } = config;
    if (
      action &&
      !whiteUrl.includes(url) &&
      !store.state.permissions.includes(action)
    ) {
      throw new Error("暂无权限");
    }
    config.headers.common["Authorization"] = setSession.token;
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  async response => {
    const { data } = response;
    if (data.err_code === 0) {
      return [null, response.data];
    } else if (data.err_code === 1001) {
      const [error, data] = await refreshToken();
      const { token } = data.data;
      if (error) {
        console.log(error);
      } else {
        setSession.token = token;
      }
    } else {
      Message({
        message: data.error.message,
        type: "error"
      });
      return [response.data, null];
    }
  },
  error => {
    Message({
      message: error.message,
      type: "error"
    });
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default axios;
