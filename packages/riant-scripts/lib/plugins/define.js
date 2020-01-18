'use strict';

const { DefinePlugin } = require('webpack');
const { isFunction, isObject } = require('../utils');

/**
 * 处理自定义配置 define
 *
 * @param {Service} service
 * @param {Object} projectOptions
 */
module.exports = function (service, projectOptions) {
  service.chainWebpack(function (chain, webpackEnv) {
    // 方便查看依赖的全局配置参数
    let { define } = projectOptions;

    if (isFunction(define)) {
      const res = define(chain, webpackEnv, service);
      if (isObject(res)) {
        define = res;
      }
    }

    if (isObject(define) && Object.keys(define).length) {
      chain
        .plugin('define')
        .after('DefinePlugin')
        .use(new DefinePlugin(define));
    }
  });
};
