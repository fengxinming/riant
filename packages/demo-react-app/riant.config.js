const { join } = require('path');

if (process.env.NODE_ENV === 'development') {
  process.stdout.isTTY = false;
}

// riant
module.exports = {
  alias: {
    '@': join(__dirname, 'src')
  },

  chainWebpack(chainedConfig, env) {
    // 剔除 console.log
    chainedConfig.optimization
      .minimizer('TerserPlugin')
      .init((plugin)=> {
        plugin.options.terserOptions.compress.pure_funcs = ['console.log'];
        return plugin;
      });
  }
};
