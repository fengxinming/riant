# riant-scripts

[![npm package](https://nodei.co/npm/riant-scripts.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/riant-scripts)

> Create your app using [create-react-app](https://github.com/facebookincubator/create-react-app) , and tweak the create-react-app webpack config(s) , especially preset `less-loader` and `stylus-loader` .

[![NPM version](https://img.shields.io/npm/v/riant-scripts.svg?style=flat)](https://npmjs.org/package/riant-scripts)
[![NPM Downloads](https://img.shields.io/npm/dm/riant-scripts.svg?style=flat)](https://npmjs.org/package/riant-scripts)

## [中文文档](README_zh-CN.md)

## Install riant-scripts

```bash
$ npm install riant-scripts --save-dev
```

### Create a riant.config.js file in the root directory

```javascript
/* riant.config.js */
module.exports = {
  // Create aliases to import or require certain modules more easily
  alias: {
    '@': path.join(__dirname, 'src')
  },
  // alias(chainedMap, env) {
  //   chainedMap.set('@', path.join(__dirname, 'src'));
  // },

  // Add babel plugins 
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

  // Configure custom webpack config
  chainWebpack(chainedConfig, env) {

  },

  // Configure custom webpack config
  configureWebpack: {  },
  // configureWebpack(objectConfig, env) {

  // }

  // Configure custom style loader options
  css: {
    loaderOptions: {
      stylus: {
        define: {
          '$color': '#fff'
        }
      }
    }
  },

  // Configure Dev Server
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

  // Attempt to resolve these extensions in order.
  extensions: ['.properties'],
  // extensions(chainedSet, env) {
  //   chainedSet.add('.properties');
  // }

  // Prevent bundling of certain imported packages and instead retrieve these external dependencies at runtime.
  externals: {
    jquery: 'jQuery'
  },
  // externals() {
  //   return ...
  // }

  // Attempt to update jest config
  jest(jestConfig) {
    return jestConfig;
  },

  // Attempt to update paths
  paths: {  },
  // paths(pathsConfig, env) {

  // }

  // use eslintrc
  useEslintrc: true

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
  paths: { instanceof: ['Function', 'Object'] },
  useEslintrc: { type: 'boolean' }
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

### Use riant-scripts instead of react-scripts in npm scripts of package.json for start、build and test

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
Note: Keep the eject script. That gets run only once for a project, after which you are given full control over the webpack configuration making riant-scripts no longer required. 

### Start the Dev Server

```bash
$ npm start
```

### Build your app

```bash
$ npm run build
```

## Example

* [test](test/react-app)
