'use strict';

const { ProgressPlugin } = require('webpack');
const chalk = require('chalk');
const Progress = require('progress');
const { isObject } = require('../utils');

const defaults = {
  template: `:bar ${chalk.green(':percent')} :msg`,
  options: {
    complete: chalk.bgGreen(' '),
    incomplete: chalk.bgWhite(' '),
    width: 40,
    total: 100,
    clear: false
  }
};

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
      const { template, options } = progressBar;
      const bar = new Progress(
        template || defaults.template,
        Object.assign({}, options, defaults.options)
      );

      chain
        .plugin('progressBar')
        .before('HtmlWebpackPlugin')
        .use(new ProgressPlugin(function (percentage, msg, moduleProgress, activeModules, moduleName) {
          bar.update(percentage, { msg: `${msg} ${moduleProgress} ${activeModules}` });
        }));
    }
  });
};
