# riant-scripts

[![npm package](https://nodei.co/npm/riant-scripts.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/riant-scripts)

> Create your app using [create-react-app](https://github.com/facebookincubator/create-react-app) , and tweak the create-react-app webpack config(s) , especially preset `less-loader` and `stylus-loader` .

[![NPM version](https://img.shields.io/npm/v/riant-scripts.svg?style=flat)](https://npmjs.org/package/riant-scripts)
[![NPM Downloads](https://img.shields.io/npm/dm/riant-scripts.svg?style=flat)](https://npmjs.org/package/riant-scripts)

## [English Documentation](https://react-hobby.github.io/riant/)
## [中文文档](https://react-hobby.github.io/riant/zh/)

## Install riant-scripts

```bash
$ npm install riant-scripts --save-dev
```

### Schema

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
  define: { instanceof: ['Function', 'Object'] },
  devServer: { instanceof: ['Function', 'Object'] },
  extensions: { instanceof: ['Function', 'Array'] },
  externals: { instanceof: ['Function', 'Array', 'RegExp', 'Object'] },
  filenameHashing: { type: 'boolean' },
  jest: { instanceof: ['Function', 'Object'] },
  pages: { type: 'object' },
  parallel: { type: ['boolean', 'number'] },
  paths: { instanceof: ['Function', 'Object'] },
  riantPlugins: { instanceof: 'Array' },
  useEslintrc: { type: 'boolean' }
}
```

### Code Structure

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
