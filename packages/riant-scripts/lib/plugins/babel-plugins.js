'use strict';

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

    if (isArray(babelPlugins)) {
      chain
        .module
        .rule('main')
        .oneOf('babel')
        .get('options')
        .plugins.push(...babelPlugins);
    }
  });
};
