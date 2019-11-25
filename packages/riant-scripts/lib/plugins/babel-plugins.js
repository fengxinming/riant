'use strict';

const { isFunction } = require('../utils');

const { isArray } = Array;
/**
 * 处理自定义配置 babelPlugins
 *
 * @param {Service} service
 * @param {Object} projectOptions
 */
module.exports = function (service, projectOptions) {
  service.chainWebpack(function (chain, webpackEnv) {
    // 方便查看依赖的全局配置参数
    const { babelPlugins } = projectOptions;

    const options = chain
      .module
      .rule('main')
      .oneOf('babel')
      .get('options');

    if (isFunction(babelPlugins)) {
      const res = babelPlugins(options.plugins);
      if (isArray(res)) {
        options.plugins = res;
      }
    } else if (isArray(babelPlugins)) {
      options.plugins.push(...babelPlugins);
    }
  });
};
