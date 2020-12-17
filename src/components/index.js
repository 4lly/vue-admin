function registrationComponents(app) {
  const files = require.context("../components", true, /index\.vue$/);
  files.keys().forEach(key => {
    const component = files(key).default;
    app.component("custom-" + component.name, component);
  });
}

export default registrationComponents;
