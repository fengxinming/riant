'use strict';

const { EOL } = require('os');
const { isAbsolute, join } = require('path');
const { existsSync } = require('fs');
const chalk = require('chalk');
const Config = require('webpack-chain');
const merge = require('webpack-merge');
const semver = require('semver');
const { defaultsDeep, isFunction, isObject, isUndefined, isString, getLogger } = require('./utils');
const { defaults, validate } = require('./options');
const initChain = require('./init-chain');

const logger = getLogger('Service');
const { isArray } = Array;
const { stringify } = JSON;

class Service {

  constructor({
    contextPath = process.cwd(),
    configFile,
    reactScriptVersion = 'react-scripts',
    plugins,
    inlineOptions
  }) {
    configFile = configFile || 'riant.config.js';

    this.contextPath = contextPath;
    this.configFile = configFile;
    this.configPath = isAbsolute(configFile) ? configFile : join(contextPath, configFile);
    this.reactScriptVersion = reactScriptVersion;
    this.reactScriptPath = join(require.resolve(`${reactScriptVersion}/package.json`), '..');
    this.inlineOptions = inlineOptions;

    this.webpackChainFns = [];
    this.webpackRawConfigFns = [];
    this.devServerConfigFns = [];

    // 加载用户自定义配置
    const userOptions = this.loadUserOptions();
    this.projectOptions = defaultsDeep(userOptions, defaults());

    // 执行插件
    if (isArray(plugins)) {
      if (isArray(this.projectOptions.riantPlugins)) {
        plugins = plugins.concat(this.projectOptions.riantPlugins);
      }
      plugins.forEach(plugin => plugin(this, this.projectOptions));
    }

    const scriptPkg = require(`${reactScriptVersion}/package.json`);

    // 2.1.2 之前的版本区分 dev 和 prod
    // https://github.com/facebook/create-react-app/pull/5722
    // https://github.com/facebook/create-react-app/releases/tag/v2.1.2
    const isWebpackFactory = semver.gte(scriptPkg && scriptPkg.version, '2.1.2');
    if (isWebpackFactory) {
      const webpackConfigPath = `${reactScriptVersion}/config/webpack.config`;
      const webpackConfig = require(webpackConfigPath);
      require.cache[require.resolve(webpackConfigPath)].exports =
        env => this.webpack(webpackConfig(env), env);
    } else {
      let configSuffix = '';
      switch (process.env.NODE_ENV) {
        case 'development':
          configSuffix = '.dev';
          break;
        case 'production':
          configSuffix = '.prod';
          break;
      }
      const webpackConfigPath = `${reactScriptVersion}/config/webpack.config${configSuffix}`;
      require.cache[require.resolve(webpackConfigPath)].exports = this.webpack(require(webpackConfigPath), process.env.NODE_ENV);
    }

    // 开发环境下加载 devServer 配置
    if (process.env.NODE_ENV === 'development') {
      const devServerConfigPath = `${reactScriptVersion}/config/webpackDevServer.config.js`;
      const devServerConfig = require(devServerConfigPath);
      require.cache[require.resolve(devServerConfigPath)].exports = this.devServer(devServerConfig, process.env.NODE_ENV);
    }
  }

  loadUserOptions() {
    // riant.config.js
    let fileConfig, resolved;
    const { configPath, configFile, reactScriptVersion } = this;
    let resolvedFrom = configFile;

    // 加载环境配置文件
    require(`${reactScriptVersion}/config/env`);

    if (existsSync(configPath)) {
      try {
        fileConfig = require(configPath);

        if (isFunction(fileConfig)) {
          fileConfig = fileConfig(this);
        }

        if (!isObject(fileConfig)) {
          logger.error(
            `Error loading ${chalk.bold(resolvedFrom)}: should export an object or a function that returns object.`
          );
          fileConfig = null;
        }
      } catch (e) {
        logger.error(`Error loading ${chalk.bold(resolvedFrom)}:`);
        throw e;
      }
    }

    if (fileConfig) {
      resolved = fileConfig;
    } else {
      resolved = this.inlineOptions || {};
      resolvedFrom = 'inline options';
    }

    const { css: cssOptions } = resolved;
    if (cssOptions && !isUndefined(cssOptions.modules)) {
      if (!isUndefined(cssOptions.requireModuleExtension)) {
        logger.warn(
          `You have set both "css.modules" and "css.requireModuleExtension" in ${chalk.bold(resolvedFrom)}, ` +
          '"css.modules" will be ignored in favor of "css.requireModuleExtension".'
        );
      } else {
        logger.warn(
          `"css.modules" option in ${chalk.bold(resolvedFrom)} ` +
          'is deprecated now, please use "css.requireModuleExtension" instead.'
        );
        cssOptions.requireModuleExtension = !cssOptions.modules;
      }
    }

    // 标准化一些参数
    ensureSlash(resolved, 'publicPath');
    if (isString(resolved.publicPath)) {
      resolved.publicPath = resolved.publicPath.replace(/^\.\//, '');
    }
    removeSlash(resolved, 'outputDir');

    // 验证参数
    validate(resolved, (err) => {
      logger.error(`Invalid options in ${chalk.bold(resolvedFrom)}:${EOL}${err.map(e => stringify(e, null, 2)).join(EOL)}`);
      process.exit(1);
    });

    return resolved;
  }

  webpack(webpackConfig, env) {
    // console.log(require('util').inspect(webpackConfig, { depth: Infinity }));
    const chainableConfig = new Config();

    // 初始化链式配置对象
    initChain(chainableConfig, webpackConfig);

    // 优先执行链式回调
    this.webpackChainFns.forEach(fn => fn(chainableConfig, env, this));

    // 获取未处理的 webpack 配置
    // 合并 chain webpack 后的配置
    let config = merge(webpackConfig, chainableConfig.toConfig());
    this.webpackRawConfigFns.forEach((fn) => {
      if (isFunction(fn)) {
        const res = fn(config, env, this);
        if (res) {
          config = merge(config, res);
        }
      } else if (fn) {
        config = merge(config, fn);
      }
    });
    // console.log(require('util').inspect(config, { depth: Infinity }));
    return config;
  }

  devServer(configFunction, env) {
    const { devServerConfigFns } = this;
    return function (proxy, allowedHost) {
      let config = configFunction(proxy, allowedHost);
      devServerConfigFns.forEach((fn) => {
        if (isFunction(fn)) {
          const res = fn(config, env);
          if (res) {
            config = merge(config, res);
          }
        } else if (fn) {
          config = merge(config, fn);
        }
      });
      return config;
    };
  }

  run(command) {
    // 执行 react-scripts 脚本
    require(`${this.reactScriptVersion}/scripts/${command}`);
  }

  chainWebpack(fn) {
    this.webpackChainFns.push(fn);
  }

  configureWebpack(fn) {
    this.webpackRawConfigFns.push(fn);
  }

  configureDevServer(fn) {
    this.devServerConfigFns.push(fn);
  }

  resolve(_path) {
    return join(this.contextPath, _path);
  }

  findExisting(files) {
    const { contextPath } = this;
    return files.find((file) => {
      if (existsSync(join(contextPath, file))) {
        return true;
      }
    });
  }

  get paths() {
    return require(`${this.reactScriptVersion}/config/paths.js`);
  }

  set paths(val) {
    // 缓存 paths
    require.cache[require.resolve(`${this.reactScriptVersion}/config/paths.js`)].exports = val;
  }

}

module.exports = Service;

function ensureSlash(config, key) {
  let val = config[key];
  if (isString(val)) {
    if (!/^https?:/.test(val)) {
      val = val.replace(/^([^/.])/, '/$1');
    }
    config[key] = val.replace(/([^/])$/, '$1/');
  }
}

function removeSlash(config, key) {
  const val = config[key];
  if (isString(val)) {
    config[key] = val.replace(/\/$/g, '');
  }
}
