import Vue from "vue";
import VueRouter from "vue-router";
import setPermission from "@/utils/setMenuAndPermission";
import store from "@/store";
import getRoutes from "./config";

Vue.use(VueRouter);

const whites = ["/", "/login"];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: getRoutes()
});

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function(location) {
  return originalPush.call(this, location).catch(err => err);
};

router.beforeEach(async (to, from, next) => {
  if (store.state.menus.length || whites.includes(to.path)) {
    next();
  } else {
    try {
      await setPermission();
      next(to);
    } catch (error) {
      next(from);
    }
  }
});

export default router;
