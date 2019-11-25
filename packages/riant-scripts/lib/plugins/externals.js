'use strict';

const { isFunction, toString } = require('../utils');

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
      const res = externals(chain.get('externals'), webpackEnv);
      // 如果有返回值，就使用返回值
      if (res) {
        chain.externals(res);
      }
    } else if (toString(externals) === '[object Object]') {
      chain.externals(Object.assign({}, chain.get('externals'), externals));
    } else if (externals) {
      chain.externals(externals);
    }
  });
};
