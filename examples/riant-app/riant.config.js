const { join } = require('path');

if (process.env.NODE_ENV === 'development') {
  process.stdout.isTTY = false;
}

// riant
module.exports = {
  alias: {
    '~': join(__dirname, 'src')
  },

  chainWebpack(chainedConfig, env) {
    if (env === 'production') {
      // 兼容ie9
      chainedConfig
        .entry('main')
        .prepend(require.resolve('react-app-polyfill/stable'))
        .prepend(require.resolve('react-app-polyfill/ie9'));

      // 移除 console.log
      chainedConfig.optimization.minimizer('TerserPlugin').init((plugin) => {
        plugin.options.terserOptions.compress.pure_funcs = ['console.log'];
        return plugin;
      });
    }

    // code splitting
    if (env !== 'test') {
      chainedConfig.optimization
        .splitChunks({
          cacheGroups: {
            vendors: {
              name: `chunk-vendors`,
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              chunks: 'initial'
            },
            common: {
              name: `chunk-common`,
              minChunks: 2,
              priority: -20,
              chunks: 'initial',
              reuseExistingChunk: true
            }
          }
        });
    }
  }
};
