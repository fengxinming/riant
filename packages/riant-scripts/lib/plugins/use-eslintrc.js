'use strict';

/**
 * 处理自定义配置 useEslintrc
 *
 * @param {Service} service
 * @param {Object} projectOptions
 */
module.exports = function (service, projectOptions) {
  service.chainWebpack(function (chain, webpackEnv) {
    // 方便查看依赖的全局配置参数
    const { useEslintrc } = projectOptions;

    if (useEslintrc) {
      process.env.EXTEND_ESLINT = 'true';
      chain.module
        .rule('eslint')
        .use('eslint-loader')
        .tap((options) => {
          options.useEslintrc = true;
          return options;
        });
    }
  });
};
