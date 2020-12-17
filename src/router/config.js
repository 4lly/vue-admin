const files = require.context("./modules", false, /\.js$/);

function getRoutes() {
  const routes = [];
  files.keys().forEach(key => {
    routes.push(...files(key).default);
  });
  return routes;
}

export default getRoutes;
