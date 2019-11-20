# riant-scripts
> 使用 [create-react-app](https://github.com/facebookincubator/create-react-app) 创建您的应用, 然后自定义 webpack 相关配置

## 安装 riant-scripts

```bash
$ npm install riant-scripts --save-dev
```

### 在根目录中创建一个 riant.config.js 文件

```javascript
/* riant.config.js */
module.exports = {
  alias: { instanceof: ['Function', 'Object'] },
  chainWebpack: { instanceof: ['Function', 'Object'] },
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
  extensions: {
    oneOf: [
      { type: 'array', items: { type: 'string' } },
      { instanceof: 'Function' }
    ]
  },
  externals: { instanceof: ['Function', 'Object'] },
  devServer: { instanceof: ['Function', 'Object'] },
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

### 启动 Dev Server

```bash
$ npm start
```

### 构建你的应用程序

```bash
$ npm run build
```

## Example

* [test](test/react-app)
