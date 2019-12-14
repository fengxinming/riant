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

#### Create aliases to import or require certain modules more easily

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

#### Add plugins to Babel

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
  babelPlugins(chainedSet, env) {
    chainedSet.add([
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
      'fix-import-imports'
    ]);
    chainedSet.add(['@babel/plugin-proposal-decorators', { legacy: true }]);
  }
}
```

#### Customize Webpack config

```javascript
/* riant.config.js */
module.exports = {
  chainWebpack(chainedConfig, env) {
    if (env === 'production') {
      // supporting Internet Explorer 9
      chainedConfig
        .entry('main')
        .prepend(require.resolve('react-app-polyfill/stable'))
        .prepend(require.resolve('react-app-polyfill/ie9'));

      // without filename hashing
      chainedConfig.output
        .filename('static/js/[name].js')
        .chunkFilename('static/js/[name].js');
      chainedConfig.plugin('MiniCssExtractPlugin').init((plugin) => {
        plugin.options.filename = 'static/css/[name].css';
        plugin.options.chunkFilename = 'static/css/[name].chunk.css';
        return plugin;
      });

      // without `console.log`
      chainedConfig.optimization.minimizer('TerserPlugin').init((plugin) => {
        plugin.options.terserOptions.compress.pure_funcs = ['console.log'];
        return plugin;
      });
    }

    // code splitting
    if (env !== 'test') {
      chainedConfig
        .optimization.splitChunks({
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

#### Customize style loader options

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

#### Customize Dev Server config

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

#### Attempt to resolve these extensions in order

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

#### Prevent bundling of certain imported packages and instead retrieve these external dependencies at runtime

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

#### Attempt to update jest config

```javascript
/* riant.config.js */
module.exports = {
  jest(jestConfig) {
    return jestConfig;
  }
}
```

#### Attempt to update paths

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

#### Add plugins to riant-scripts

```javascript
/* riant.config.js */
module.exports = {
  riantPlugins: [
    function (service, projectOptions) {

    }
  ]
}
```

[plugins reference](lib/plugins)

#### Use eslintrc

```javascript
/* riant.config.js */
module.exports = {
  useEslintrc: true
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
