const menu = [
  {
    path: "/menu",
    name: "menu",
    component: () =>
      import(/* webpackChunkName: "menu" */ "@/views/menu/index"),
    children: []
  }
];

export default menu;
