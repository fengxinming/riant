---
sidebar: auto
---

# Config Reference

## riant.config.js

`riant.config.js` is an optional config file that will be automatically loaded by `riant-scripts`.

The file should export an object containing options:

```js
// riant.config.js
module.exports = {
  // 选项...
}
```

### alias

* Type: Object | Function

* Default: undefined

**Create aliases to import or require certain modules more easily**

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

**Add plugins to Babel**

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

**Customize Webpack config**

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

**Customize Webpack config**

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

**Customize style loader options**

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

**define global constants**

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

**Customize Dev Server config**

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

**Attempt to resolve these extensions in order**

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

**Prevent bundling of certain imported packages and instead retrieve these external dependencies at runtime**

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

**Attempt to remove hash from filename**

```js
module.exports = {
  filenameHashing: false
}
```

### jest

* Type: Function

* Default: config => config

**Attempt to update jest config**

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

**multi-page setup**

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

**Attempt to update paths**

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

**use thread-loader for Babel or TypeScript transpilation**

```js
module.exports = {
  parallel: true
}
```

### progressBar

* Type: Boolean | Object

* Default: undefined

**Add progress bar**

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

**Add plugins to riant-scripts**

```js
module.exports = {
  riantPlugins: [
    function (service, projectOptions) {

    }
  ]
}
```

[learn more](https://github.com/react-hobby/riant/tree/master/packages/riant-scripts/lib/plugins)

### useEslintrc

* Type: Boolean

* Default: undefined

**Use eslintrc**

```js
module.exports = {
  useEslintrc: true
}
```

## Extended Webpack Configuration

### Supporting Internet Explorer 9

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

### Without console.log

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

### Code splitting

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

### Set env for production 

**Create .env.production file in the root directory**

```env
# Source maps are resource heavy and can cause out of memory issue for large source files.
GENERATE_SOURCEMAP=false

# Some apps do not need the benefits of saving a web request, so not inlining the chunk makes for a smoother build process.
INLINE_RUNTIME_CHUNK=false

IMAGE_INLINE_SIZE_LIMIT=30000
```