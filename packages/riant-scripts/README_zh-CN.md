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

```javascript
/* riant.config.js */
module.exports = {
  // 配置别名
  alias: {
    '@': path.join(__dirname, 'src')
  },
  // alias(chainedMap, env) {
  //   chainedMap.set('@', path.join(__dirname, 'src'));
  // },

  // 配置 babel 插件 
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
  ],
  // babelPlugins(arr, env) {
  //   return arr.concat([
  //     'import',
  //     {
  //       libraryName: 'antd',
  //       libraryDirectory: 'es',
  //       style: 'css',
  //     },
  //     'fix-import-imports'
  //   ], ['@babel/plugin-proposal-decorators', { legacy: true }]);
  //   // or
  //   arr.push([
  //     'import',
  //     {
  //       libraryName: 'antd',
  //       libraryDirectory: 'es',
  //       style: 'css',
  //     },
  //     'fix-import-imports'
  //   ], ['@babel/plugin-proposal-decorators', { legacy: true }]);
  // }

  // 增加自定义配置
  chainWebpack(chainedConfig, env) {

  },

  // 增加自定义配置
  configureWebpack: {  },
  // configureWebpack(objectConfig, env) {

  // }

  // 配置 loader 参数
  css: {
    loaderOptions: {
      stylus: {
        define: {
          '$color': '#fff'
        }
      }
    }
  },

  // 配置本地开发服务
  devServer: { 
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true
      }
    },
  },
  // devServer(devConfig, env) {

  // }

  // 查找文件的扩展名集合
  extensions: ['.properties'],
  // extensions(chainedSet, env) {
  //   chainedSet.add('.properties');
  // }

  // 导入外部扩展
  externals: {
    jquery: 'jQuery'
  },
  // externals() {
  //   return ...
  // }

  // jest 配置
  jest(jestConfig) {
    return jestConfig;
  },

  // 配置内置的 path
  paths: {  }
  // paths(pathsConfig, env) {

  // }

}
```

### Schema

```javascript
/* riant.config.js */
module.exports = {
  alias: { instanceof: ['Function', 'Object'] },
  babelPlugins: { instanceof: ['Function', 'Array'] },
  chainWebpack: { instanceof: 'Function' },
  configureWebpack: { instanceof: ['Function', 'Object'] },
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
  paths: { instanceof: ['Function', 'Object'] }
}
```

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

## Example

* [test](test/react-app)
