'use strict';

const yup = require('yup');

const schema = yup.object().shape({
  alias: yup.object(),
  chainWebpack: yup.object(),
  configureWebpack: yup.object(),
  css: yup.object({
    modules: yup.boolean(),
    sourceMap: yup.boolean(),
    loaderOptions: yup.object({
      css: yup.object(),
      sass: yup.object(),
      scss: yup.object(),
      less: yup.object(),
      stylus: yup.object(),
      postcss: yup.object()
    })
  }),
  extensions: yup.array(),
  externals: yup.object(),
  devServer: yup.object(),
  paths: yup.object()
});

exports.validate = function (resolved) {
  return schema.validate(resolved, {
    strict: true,
    stripUnknown: true
  });
};

exports.defaults = () => ({
  // multi-page config
  pages: undefined,

  css: {
    // modules: false,
    // sourceMap: false,
    // loaderOptions: {}
  },

  devServer: {
    /*
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: null, // string | Object
    before: app => {}
  */
  }
});
