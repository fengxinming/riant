---
sidebar: auto
---

# 配置参考

## riant.config.js

`riant.config.js` 是一个可选的配置文件，如果项目的 (和 package.json 同级的) 根目录中存在这个文件，那么它会被 `riant-scripts` 自动加载。

这个文件应该导出一个包含了选项的对象：

```js
// riant.config.js
module.exports = {
  // 选项...
}
```

### alias

* Type: Object | Function

* Default: undefined

**配置别名**

```js
module.exports = {
  alias: {
    '@': path.join(__dirname, 'src')
  }
}
```

```js
module.exports = {
  alias(chainedMap, env) {
    chainedMap.set('@', path.join(__dirname, 'src'));
  }
}
```

### babelPlugins

* Type: Array | Function

* Default: undefined

**配置 babel 插件**

```js
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

```js
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

```js
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

### chainWebpack

* Type: Function

* Default: undefined

**增加自定义配置**

```js
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
  }
}
```

### configureWebpack

* Type: Function

* Default: undefined

**增加自定义配置**

```js
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

### css

* Type: Object

* Default: {}

**配置 loader 参数**

```js
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

### define

* Type: Object | Function

* Default: undefined

**定义全局常量**

```js
module.exports = {
  define: {
    __version__: JSON.stringify('1.0.0')
  }
}
```

```js
module.exports = {
  define(chainedMap, env, service) {
    return {
      __version__: JSON.stringify('1.0.0')
    };
  }
}
```

### devServer

* Type: Object | Function

* Default: {}

**配置本地开发服务**

```js
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

```js
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

### extensions

* Type: Object | Function

* Default: undefined

**查找文件的扩展名集合**

```js
module.exports = {
  extensions: ['.properties']
}
```

```js
module.exports = {
  extensions(chainedSet, env) {
    chainedSet.add('.properties');
  }
}
```

### externals

* Type: Object | Function

* Default: undefined

**导入外部扩展**

```js
module.exports = {
  externals: {
    jquery: 'jQuery'
  }
}
```

```js
module.exports = {
  externals() {
    return {
      jquery: 'jQuery'
    };
  }
}
```

### filenameHashing

* Type: Boolean

* Default: true

**是否移除 hash 文件名**

```js
module.exports = {
  filenameHashing: false
}
```

### jest

* Type: Function

* Default: config => config

**jest 配置**

```js
module.exports = {
  jest(jestConfig) {
    return jestConfig;
  }
}
```

### pages

* Type: Object

* Default: undefined

**配置多页支持**

```js
module.exports = {
  pages: {
    index: 'src/index.js',
    home: 'src/home.js',
    form: 'src/form.js',
    notfound: 'src/notfound.js'
  }
}
```

### paths

* Type: Object | Function

* Default: undefined

**配置内置的 paths**

```js
module.exports = {
  paths: { 

  }
}
```

```js
module.exports = {
  paths(pathsConfig, env) {

  }
}
```

### parallel

* Type: Boolean

* Default: false

**为 Babel 或 TypeScript 使用 thread-loader，仅作用于生产构建**

```js
module.exports = {
  parallel: true
}
```

### progressBar

* Type: Boolean | Object

* Default: undefined

**增加进度条**

```js
module.exports = {
  progressBar: true
}
```

```js
module.exports = {
  progressBar: {
    progress: {},
    profileLevel: 2,
    profile: false,
    modulesCount: 500,
    modules: true,
    activeModules: true,
    entries: false
    handler: () => {}
  }
}
```

### riantPlugins

* Type: Array

* Default: undefined

**增加自定插件至 riant-scripts**

```js
module.exports = {
  riantPlugins: [
    function (service, projectOptions) {

    }
  ]
}
```

[插件参考](https://github.com/fengxinming/riant/tree/master/packages/riant-scripts/lib/plugins)

### useEslintrc

* Type: Boolean

* Default: undefined

**自定义 eslintrc 文件，扩展 eslint 规则**

```js
module.exports = {
  useEslintrc: true
}
```

## 扩展 Webpack 配置

### 兼容 ie9

```javascript
/* riant.config.js */
module.exports = {
  chainWebpack(chainedConfig, env) {
    if (env === 'production') {
      chainedConfig
        .entry('main')
        .prepend(require.resolve('react-app-polyfill/stable'))
        .prepend(require.resolve('react-app-polyfill/ie9'));
    }
}
```

### 移除 console.log

```javascript
/* riant.config.js */
module.exports = {
  chainWebpack(chainedConfig, env) {
    if (env === 'production') {
      chainedConfig.optimization
        .minimizer('TerserPlugin')
        .init((plugin) => {
          plugin.options.terserOptions.compress.pure_funcs = ['console.log'];
          return plugin;
        });
    }
}
```

### 代码拆分

```javascript
/* riant.config.js */
module.exports = {
  chainWebpack(chainedConfig, env) {
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
    }
}
```

### 修改打包配置

**在根目录中创建一个 .env.production 文件**

```env
# 是否生成 .map 文件
GENERATE_SOURCEMAP=false

# 是否把 runtime chunk 生成到 html 模板中
INLINE_RUNTIME_CHUNK=false

# 编码图片的大小限制
IMAGE_INLINE_SIZE_LIMIT=30000
```