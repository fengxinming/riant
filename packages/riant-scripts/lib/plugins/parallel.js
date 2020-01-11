'use strict';

const { cpus, tmpdir } = require('os');
const findCacheDir = require('find-cache-dir');

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
      ['babel', 'babel-outside'].forEach(function (ruleName) {
        const babelRule = chain.module
          .rule('main')
          .oneOf(ruleName);

        const babelOptions = babelRule
          .use('babel-loader')
          .get('options');
        babelOptions.cacheDirectory = false;

        const threadLoaderConfig = babelRule
          .use('thread-loader')
          .loader(require.resolve('thread-loader'))
          .before('babel-loader');

        if (isNumber(parallel)) {
          threadLoaderConfig.options({ workers: parallel });
        }

        babelRule
          .use('cache-loader')
          .loader(require.resolve('cache-loader'))
          .options({
            cacheIdentifier: babelOptions.cacheIdentifier,
            cacheDirectory: findCacheDir({
              name: 'babel-loader'
            }) || tmpdir()
          })
          .before('thread-loader');

        chain.optimization
          .minimizer('TerserPlugin')
          .init((plugin) => {
            plugin.options.parallel = parallel;
            return plugin;
          });
      });
    }

  });
};
