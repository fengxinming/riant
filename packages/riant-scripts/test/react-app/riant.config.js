// kyo
module.exports = {
  jest(config) {
    return config;
  },

  configureWebpack(webpackConfig) {
    // console.log(webpackConfig.module.rules[2]);
  },

  devServer: {},

  paths(paths, env) {
    return paths;
  }
};
