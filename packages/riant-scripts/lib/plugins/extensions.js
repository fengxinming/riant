'use strict';

const { isFunction } = require('../utils');
const { isArray } = Array;

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
    } else if (isArray(extensions)) {
      extensions.forEach((extenstion) => {
        chain.resolve.extensions.add(extenstion);
      });
    }
  });
};
