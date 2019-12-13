const { join } = require('path');
// require('react-app-polyfill')

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

      // 移除文件 hash
      chainedConfig.output
        .filename('static/js/[name].js')
        .chunkFilename('static/js/[name].js');
      chainedConfig.plugin('MiniCssExtractPlugin').init((plugin) => {
        plugin.options.filename = 'static/css/[name].css';
        plugin.options.chunkFilename = 'static/css/[name].chunk.css';
        return plugin;
      });
    }
  }
};
