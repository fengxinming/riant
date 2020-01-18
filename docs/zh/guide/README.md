---
sidebar: auto
---

# 指南

## 什么是 riant-scripts

`riant-scripts` 基于 `react-scripts` 封装的一个 React 构建工具，适用于 `create-react-app` 创建的项目，在不使用 eject 命令的情况下，轻松扩展 webpack 配置。

## 在项目中使用 riant-scripts

> 注：项目由 `create-react-app` 创建

### 安装 riant-scripts

```bash
$ npm install riant-scripts --save-dev
```

### 替换 package.json 中 scripts 命令

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

### 在根目录中创建 riant.config.js

* 代码结构

```
+-- your-project
|   +-- riant.config.js
|   +-- node_modules
|   +-- package.json
|   +-- public
|   +-- README.md
|   +-- src
```

* Schema

```js
module.exports = {
  alias: { instanceof: ['Function', 'Object'] },
  babelPlugins: { instanceof: ['Function', 'Array'] },
  chainWebpack: { instanceof: 'Function' },
  configureWebpack: { instanceof: 'Function' },
  css: {
    type: 'object',
    properties: {
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

* 自定义 webpack 配置，具体参见[配置参考](/zh/config/)

### 启动开发服务

```bash
$ npm start
```

### 构建你的应用程序

```bash
$ npm run build
```

## 使用模板创建项目

### 下载模板

```bash
# npm 5.2+
npx create-react-app my-app --template riant
# npm 6+
npm init react-app my-app --template riant
# Yarn 0.25+
yarn create react-app my-app --template riant
```

### 启动服务

```bash
cd my-app
npm start
```

### 模板列表

| Template | Version | Docs | Usage |
| ------- | ------- | ---- | ----------- |
| [`riant`](packages/cra-template-riant) | [![npm](https://img.shields.io/npm/v/cra-template-riant.svg?style=flat-square)](https://www.npmjs.com/package/cra-template-riant) | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](packages/cra-template-riant#readme) | npm init react-app my-app --template riant |
| [`riant-antd`](packages/cra-template-riant-antd) | [![npm](https://img.shields.io/npm/v/cra-template-riant-antd.svg?style=flat-square)](https://www.npmjs.com/package/cra-template-riant-antd) | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](packages/cra-template-riant-antd#readme) | npm init react-app my-app --template riant-antd |
| [`riant-order-management`](packages/cra-template-riant-order-management) | [![npm](https://img.shields.io/npm/v/cra-template-riant-order-management.svg?style=flat-square)](https://www.npmjs.com/package/cra-template-riant-order-management) | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](packages/cra-template-riant-order-management#readme) | npm init react-app my-app --template riant-order-management |