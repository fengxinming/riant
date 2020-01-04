const { join } = require('path');

// if (process.env.NODE_ENV === 'development') {
//   process.stdout.isTTY = false;
// }

module.exports = {
  // 配置别名
  alias: {
    '~': join(__dirname, 'src')
  },

  // 配置 babel 插件
  babelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css'
      },
      'fix-import-imports'
    ],
    [ '@babel/plugin-proposal-decorators', { legacy: true } ],
    'babel-plugin-transform-jsx-class',
    'babel-plugin-transform-jsx-condition'
  ],

  // 自定义 webpack 配置
  chainWebpack(chainedConfig, env) {
    if (env === 'production') {
      // 移除警告
      chainedConfig
        .plugin('MiniCssExtractPlugin')
        .init((plugin) => {
          const { options } = plugin;
          options.ignoreOrder = true;
          return plugin;
        });

      // 移除 console.log
      chainedConfig.optimization
        .minimizer('TerserPlugin')
        .init((plugin) => {
          plugin.options.terserOptions.compress.pure_funcs = [ 'console.log' ];
          return plugin;
        });

      // 兼容ie9
      // chainedConfig
      //   .entry('main')
      //   .prepend(require.resolve('react-app-polyfill/stable'))
      //   .prepend(require.resolve('react-app-polyfill/ie9'));
    }

    // code splitting
    if (env !== 'test') {
      chainedConfig
        .optimization.splitChunks({
          cacheGroups: {
            vendors: {
              name: 'chunk-vendors',
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              chunks: 'initial'
            },
            common: {
              name: 'chunk-common',
              minChunks: 2,
              priority: -20,
              chunks: 'initial',
              reuseExistingChunk: true
            }
          }
        });
    }
  },

  // 查找文件的扩展名集合
  extensions(chainedSet) {
    chainedSet
      .clear()
      .add('.js');
  },

  // 进度条
  progressBar: {
    profile: true
  },

  // 多进程打包
  parallel: true,

  // 使用 eslintrc 文件
  useEslintrc: true
};
