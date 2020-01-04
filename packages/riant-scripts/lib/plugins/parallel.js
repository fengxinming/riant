'use strict';

const { cpus } = require('os');
const threadLoader = require('thread-loader');
const { isNumber } = require('../utils');

/**
 * 处理自定义配置 parallel
 *
 * @param {Service} service
 * @param {Object} projectOptions
 */
module.exports = function (service, projectOptions) {
  service.chainWebpack(function (chain, webpackEnv) {
    // 方便查看依赖的全局配置参数
    const { parallel } = projectOptions;

    let useThreads = webpackEnv === 'production' && !!parallel;

    try {
      useThreads = useThreads && cpus().length > 1;
    } catch (e) {
      useThreads = false;
    }

    if (useThreads) {
      threadLoader.warmup({
        // 线程池参数
        workers: isNumber(parallel) ? parallel : undefined
      }, [
        // 模块被加载
        'babel-loader'
      ]);
      ['babel', 'babel-outside'].forEach(function (ruleName) {
        const threadLoaderConfig = chain.module
          .rule('main')
          .oneOf(ruleName)
          .use('thread-loader')
          .loader(require.resolve('thread-loader'))
          .before('babel-loader');

        if (isNumber(parallel)) {
          threadLoaderConfig.options({ workers: parallel });
        }
      });

      chain.optimization
        .minimizer('TerserPlugin')
        .init((plugin) => {
          plugin.options.parallel = parallel;
          return plugin;
        });
    }

  });
};
