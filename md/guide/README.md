---
sidebar: auto
---

# Guide

## riant-scripts

### Introduction

`riant-scripts` is a React build tool that base on `react-scripts` to be used for a React project，you can configure webpack easily without using 'eject' and without creating a fork of the react-scripts。

### How it works

> PS：That is much better to create a project with `create-react-app`

#### Installation

```bash
$ npm install riant-scripts --save-dev
```

#### Change package.json

Change npm scripts in package.json

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
PS：Do not change `eject` script。That gets run only once for a project, after which you are given full control over the webpack configuration making riant-scripts no longer required. There are no configuration options to rewire for the eject script.

#### Create riant.config.js

Create a riant.config.js file in the root directory

* Code structure

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

* Configure webpack，learn more [Config Reference](/config/)

#### Start the Dev Server

```bash
$ npm start
```

#### Build your App

```bash
$ npm run build
```

## Template

### Create project

#### Create a project with a template

```bash
# npm 5.2+
npx create-react-app my-app --template riant
# npm 6+
npm init react-app my-app --template riant
# Yarn 0.25+
yarn create react-app my-app --template riant
```

#### Start the Dev Server

```bash
cd my-app
npm start
```

### Templates

| Template | Version | Docs | Usage |
| ------- | ------- | ---- | ----------- |
| [`riant`](packages/cra-template-riant) | [![npm](https://img.shields.io/npm/v/cra-template-riant.svg?style=flat-square)](https://www.npmjs.com/package/cra-template-riant) | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](packages/cra-template-riant#readme) | npm init react-app my-app --template riant |
| [`riant-antd`](packages/cra-template-riant-antd) | [![npm](https://img.shields.io/npm/v/cra-template-riant-antd.svg?style=flat-square)](https://www.npmjs.com/package/cra-template-riant-antd) | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](packages/cra-template-riant-antd#readme) | npm init react-app my-app --template riant-antd |
| [`riant-order-management`](packages/cra-template-riant-order-management) | [![npm](https://img.shields.io/npm/v/cra-template-riant-order-management.svg?style=flat-square)](https://www.npmjs.com/package/cra-template-riant-order-management) | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](packages/cra-template-riant-order-management#readme) | npm init react-app my-app --template riant-order-management |