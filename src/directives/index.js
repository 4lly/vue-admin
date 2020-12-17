function registrationDirectives(app) {
  const files = require.context("./module", true, /index\.js$/);
  files.keys().forEach(key => {
    const { name, value } = files(key).default;
    app.directive(name, value);
  });
}

export default registrationDirectives;
