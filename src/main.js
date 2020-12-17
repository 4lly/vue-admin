import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./element.config";
import "normalize.css";
import "@/assets/css/reset.css";
import registrationComponents from "@/components/index";
import registrationDirectives from "@/directives";
Vue.config.productionTip = false;

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

registrationComponents(Vue);
registrationDirectives(Vue);

export default app;
