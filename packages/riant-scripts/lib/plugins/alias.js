'use strict';

const { isFunction, isObject } = require('../utils');

/**
 * 处理自定义配置 alias
 *
 * @param {Service} service
 * @param {Object} projectOptions
 */
module.exports = function (service, projectOptions) {
  service.chainWebpack(function (chain, webpackEnv) {
    // 方便查看依赖的全局配置参数
    const { alias } = projectOptions;

    if (isFunction(alias)) {
      alias(chain.resolve.alias, webpackEnv);
    } else if (isObject(alias)) {
      chain.resolve.alias.merge(alias);
    }
  });
};
