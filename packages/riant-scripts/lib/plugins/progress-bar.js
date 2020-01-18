'use strict';

const CliProgressPlugin = require('cli-progress-webpack-plugin');
const { isObject } = require('../utils');

/**
 * 处理自定义配置 progressBar
 *
 * @param {Service} service
 * @param {Object} projectOptions
 */
module.exports = function (service, projectOptions) {
  service.chainWebpack(function (chain, webpackEnv) {
    // 方便查看依赖的全局配置参数
    let { progressBar } = projectOptions;

    if (progressBar === true) {
      progressBar = {};
    }

    if (isObject(progressBar)) {
      chain
        .plugin('progressBar')
        .after('noop')
        .use(new CliProgressPlugin(progressBar));
    }
  });
};
