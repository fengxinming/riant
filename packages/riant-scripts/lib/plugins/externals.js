'use strict';

const { isFunction, isObject } = require('../utils');

/**
 * 处理自定义配置 externals
 *
 * @param {Service} service
 * @param {Object} projectOptions
 */
module.exports = function (service, projectOptions) {
  service.chainWebpack(function (chain, webpackEnv) {
    // 方便查看依赖的全局配置参数
    const { externals } = projectOptions;

    if (isFunction(externals)) {
      externals(chain.externals, webpackEnv);
    } else if (isObject(externals)) {
      chain.externals.merge(externals);
    }
  });
};
