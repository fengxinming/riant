const { join } = require('path');

module.exports = {
  alias: {
    '~': join(__dirname, 'src')
  },

  chainWebpack(chainedConfig, env) {
    if (env === 'production') {
      // 剔除 console.log
      chainedConfig.optimization.minimizer('TerserPlugin').init((plugin) => {
        plugin.options.terserOptions.compress.pure_funcs = ['console.log'];
        return plugin;
      });
    }
  }
};
