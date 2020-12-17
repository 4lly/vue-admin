const login = [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/login/index")
  },
  {
    path: "/",
    redirect: "/login"
  }
];

export default login;
