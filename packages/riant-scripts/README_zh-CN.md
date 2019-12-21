# riant-scripts

[![npm package](https://nodei.co/npm/riant-scripts.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/riant-scripts)

> 使用 [create-react-app](https://github.com/facebookincubator/create-react-app) 创建您的应用, 然后自定义 webpack 相关配置, 内置 less 和 stylus 配置规则.

[![NPM version](https://img.shields.io/npm/v/riant-scripts.svg?style=flat)](https://npmjs.org/package/riant-scripts)
[![NPM Downloads](https://img.shields.io/npm/dm/riant-scripts.svg?style=flat)](https://npmjs.org/package/riant-scripts)

## [English Documentation](README.md)

## 安装 riant-scripts

```bash
$ npm install riant-scripts --save-dev
```

### 在根目录中创建一个 riant.config.js 文件

#### 配置别名

```javascript
/* riant.config.js */
module.exports = {
  alias: {
    '@': path.join(__dirname, 'src')
  }
}
```

```javascript
/* riant.config.js */
module.exports = {
  alias(chainedMap, env) {
    chainedMap.set('@', path.join(__dirname, 'src'));
  }
}
```

#### 配置 babel 插件 

```javascript
/* riant.config.js */
module.exports = {
  babelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
      'fix-import-imports'
    ], 
    ['@babel/plugin-proposal-decorators', { legacy: true }]
  ]
}
```

```javascript
/* riant.config.js */
module.exports = {
  babelPlugins(plugins, env) {
    plugins.push(
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: 'css',
        },
        'fix-import-imports'
      ],
      ['@babel/plugin-proposal-decorators', { legacy: true }]
    );
  }
}
```

```javascript
/* riant.config.js */
module.exports = {
  babelPlugins(plugins, env) {
    return plugins.concat([
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: 'css',
        },
        'fix-import-imports'
      ],
      ['@babel/plugin-proposal-decorators', { legacy: true }]
    ]);
  }
}
```

#### 增加自定义配置

```javascript
/* riant.config.js */
module.exports = {
  chainWebpack(chainedConfig, env) {
    if (env === 'production') {
      // 移除 `console.log`
      chainedConfig.optimization
        .minimizer('TerserPlugin')
        .init((plugin) => {
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
      chainedConfig
        .plugin('HtmlWebpackPlugin')
        .init((plugin) => {
          plugin.options.chunks = ['chunk-vendors', 'chunk-common', 'main'];
          return plugin;
        });
    }
  }
}
```

```javascript
/* riant.config.js */
module.exports = {
  configureWebpack(objectConfig, env) {
    if (env === 'production') {
      // without `console.log`
      objectConfig
        .optimization
        .minimizer[0]
        .options
        .terserOptions
        .compress
        .pure_funcs = ['console.log'];
    }
  }
}
```

#### 配置 loader 参数

```javascript
/* riant.config.js */
module.exports = {
  css: {
    loaderOptions: {
      stylus: {
        define: {
          '$cdn': 'https://cdn.jsdelivr.net'
        }
      }
    }
  }
}
```

#### 配置本地开发服务

```javascript
/* riant.config.js */
module.exports = {
  devServer: { 
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true
      }
    },
  }
}
```

```javascript
/* riant.config.js */
module.exports = {
  devServer(devConfig, env) {
    devConfig.proxy = {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true
      }
    };
  }
}
```

#### 查找文件的扩展名集合

```javascript
/* riant.config.js */
module.exports = {
  extensions: ['.properties']
}
```

```javascript
/* riant.config.js */
module.exports = {
  extensions(chainedSet, env) {
    chainedSet.add('.properties');
  }
}
```

#### 导入外部扩展

```javascript
/* riant.config.js */
module.exports = {
  externals: {
    jquery: 'jQuery'
  }
}
```

```javascript
/* riant.config.js */
module.exports = {
  externals() {
    return {
      jquery: 'jQuery'
    };
  }
}
```

#### 移除文件名 hash

```javascript
/* riant.config.js */
module.exports = {
  filenameHashing: false
}
```

#### jest 配置

```javascript
/* riant.config.js */
module.exports = {
  jest(jestConfig) {
    return jestConfig;
  }
}
```

#### 配置内置的 path

```javascript
/* riant.config.js */
module.exports = {
  paths: { 

  }
}
```

```javascript
/* riant.config.js */
module.exports = {
  paths(pathsConfig, env) {

  }
}
```

#### 增加自定插件至 riant-scripts

```javascript
/* riant.config.js */
module.exports = {
  riantPlugins: [
    function (service, projectOptions) {

    }
  ]
}
```

[插件参考](lib/plugins)

#### 自定义 eslintrc 扩展 eslint 规则

```javascript
/* riant.config.js */
module.exports = {
  useEslintrc: true
}
```

### 代码结构

```
+-- your-project
|   +-- riant.config.js
|   +-- node_modules
|   +-- package.json
|   +-- public
|   +-- README.md
|   +-- src
```

### 替换 package.json 中 scripts 执行部分

```diff
  /* package.json */

  "scripts": {
-   "start": "react-scripts start",
+   "start": "riant-scripts start",
-   "build": "react-scripts build",
+   "build": "riant-scripts build",
-   "test": "react-scripts test --env=jsdom",
+   "test": "riant-scripts test --env=jsdom",
    "eject": "react-scripts eject"
}
```
 注意：不用替换 `eject` 部分。工具中没有针对 `eject` 的配置替换，执行了 eject 命令会让工具失去作用。

### 启动开发服务

```bash
$ npm start
```

### 构建你的应用程序

```bash
$ npm run build
```

## Schema

```javascript
/* riant.config.js */
module.exports = {
  alias: { instanceof: ['Function', 'Object'] },
  babelPlugins: { instanceof: ['Function', 'Array'] },
  chainWebpack: { instanceof: 'Function' },
  configureWebpack: { instanceof: 'Function' },
  css: {
    type: 'object',
    properties: {
      modules: { type: 'boolean' },
      sourceMap: { type: 'boolean' },
      loaderOptions: {
        type: 'object',
        properties: {
          css: { type: 'object' },
          less: { type: 'object' },
          stylus: { type: 'object' },
          postcss: { type: 'object' }
        }
      }
    }
  },
  devServer: { instanceof: ['Function', 'Object'] },
  extensions: { instanceof: ['Function', 'Array'] },
  externals: { instanceof: ['Function', 'Array', 'RegExp', 'Object'] },
  jest: { instanceof: ['Function', 'Object'] },
  paths: { instanceof: ['Function', 'Object'] },
  riantPlugins: { instanceof: 'Array' },
  useEslintrc: { type: 'boolean' }
}
```