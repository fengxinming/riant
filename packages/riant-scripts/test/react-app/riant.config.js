'use strict';

const { join } = require('path');

if (process.env.NODE_ENV === 'development') {
  process.stdout.isTTY = false;
}

// riant
module.exports = {
  alias: {
    '@': join(__dirname, 'src')
  },

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
