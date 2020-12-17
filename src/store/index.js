import Vue from "vue";
import Vuex from "vuex";
import { setSession } from "@/utils/cache";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    permissions: [],
    menus: [],
    user: setSession.user || {}
  },
  mutations: {
    setPermissions(state, data) {
      state.permissions = data;
    },
    setMenus(state, data) {
      state.menus = data;
    },
    setUser(state, data) {
      state.user = data;
    }
  },
  actions: {},
  modules: {}
});
