'use strict';

/**
 * 处理自定义配置 filenameHashing
 *
 * @param {Service} service
 * @param {Object} projectOptions
 */
module.exports = function (service, projectOptions) {
  service.chainWebpack(function (chain, webpackEnv) {
    // 方便查看依赖的全局配置参数
    const { filenameHashing } = projectOptions;

    if (!filenameHashing) {
      const HASH_RE = /\.\[[a-z]*hash:\d+\]/;

      const { output } = chain;
      output
        .filename(output.get('filename').replace(HASH_RE, ''))
        .chunkFilename(output.get('chunkFilename').replace(HASH_RE, ''));
      chain.plugin('MiniCssExtractPlugin').init((plugin) => {
        const { options } = plugin;
        options.filename = options.filename.replace(HASH_RE, '');
        options.chunkFilename = options.chunkFilename.replace(HASH_RE, '');
        return plugin;
      });
    }
  });
};
