import router from "@/router";
import app from "@/main";
import { queryMenusAndPermission } from "@/server/login";

function saveMenusAndPermissions(menus, permissions) {
  app.$store.commit("setPermissions", permissions);
  app.$store.commit("setMenus", menus);
}

function saveRoute(data) {
  const { length } = data;
  const { routes } = router.options;
  const menus = routes.find(i => i.path === "/menu");
  for (let i = 0; i < length; i++) {
    const item = data[i];
    const route = {};
    route["path"] = item.path;
    route["name"] = item.menuName;
    route["component"] = () => import(`@/views${item.componentFilePath}/index`);
    menus.children.push(route);
  }
  router.addRoutes(routes);
  return true;
}

function getPermissions(data) {
  return data.map(item => item.action);
}

function setTreeData(data) {
  const { length } = data;
  for (let i = 0; i < length; i++) {
    const item = data[i];
    for (let j = 0; j < length; j++) {
      const currentItem = data[j];
      if (item.menuId === currentItem.parentId) {
        item.children = item.children || [];
        item.children.push(currentItem);
      }
    }
  }
}

function getMenusAndRoutes(data) {
  let menus = [];
  let routes = [];
  setTreeData(data);
  const { length } = data;
  for (let i = 0; i < length; i++) {
    const item = data[i];
    if (item.parentId === 0) {
      menus.push(item);
    }
    if (!item.children) {
      routes.push(item);
    }
  }
  return { menus, routes };
}

async function setPermission() {
  const [error, data] = await queryMenusAndPermission();
  if (error) {
    console.log(error);
  } else {
    const { menus, routes } = getMenusAndRoutes(data.data.menus);
    const permissions = getPermissions(data.data.permissions);
    saveMenusAndPermissions(menus, permissions);
    saveRoute(routes);
  }
}

export default setPermission;
