'use strict';

const { isFunction, isObject } = require('../utils');

/**
 * 处理自定义配置 extensions
 *
 * @param {Service} service
 * @param {Object} projectOptions
 */
module.exports = function (service, projectOptions) {
  service.chainWebpack(function (chain, webpackEnv) {
    // 方便查看依赖的全局配置参数
    const { extensions } = projectOptions;

    if (isFunction(extensions)) {
      extensions(chain.resolve.extensions, webpackEnv);
    } else if (isObject(extensions)) {
      chain.resolve.alias.merge(extensions);
    }
  });
};
