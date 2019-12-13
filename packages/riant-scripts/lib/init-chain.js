'use strict';

const { isObject } = require('./utils');
const { isArray } = Array;

/**
 * 便于操作配置规则
 *
 * @param {webpack-chain} chain
 * @param {Object} webpackConfig
 */
module.exports = function (chain, webpackConfig) {
  chain
    .mode(webpackConfig.mode)
    .bail(webpackConfig.bail)
    .devtool(webpackConfig.devtool);

  chain.entry('main').merge(webpackConfig.entry);

  chain.output.merge(webpackConfig.output);

  chainOptimization(chain.optimization, webpackConfig.optimization);

  chainResolve(chain.resolve, webpackConfig.resolve);

  chainModule(chain.module, webpackConfig.module);

  chainPlugins(chain, webpackConfig.plugins);

  chain.node.merge(webpackConfig.node);

  clear(webpackConfig, [
    'output',
    'optimization',
    'resolve',
    'module',
    'plugins',
    'node'
  ]);
};

/**
 * 初始化 optimization 节点
 * @param {ChainedMap} chainableOptimization
 * @param {Object} optimizationConfig
 */
function chainOptimization(chainableOptimization, optimizationConfig) {
  chainableOptimization.merge(optimizationConfig, 'minimizer');
  optimizationConfig.minimizer.forEach((n, i) => {
    const { name } = n.constructor;
    chainableOptimization.minimizer(name === 'Object' ? i : name).use(n);
  });
}

/**
 * 初始化 resolve 节点
 * @param {ChainedMap} chainableResolve
 * @param {Object} resolveConfig
 */
function chainResolve(chainableResolve, resolveConfig) {
  chainableResolve.merge(resolveConfig, ['plugin']);
  chainPlugins(chainableResolve, resolveConfig.plugins);
}

/**
 * 初始化 module 节点
 * @param {ChainedMap} chainableModule
 * @param {Object} moduleConfig
 */
function chainModule(chainableModule, moduleConfig) {
  chainableModule.merge(moduleConfig, ['rules']);

  moduleConfig.rules.forEach((ruleConfig, i) => {
    const ruleName = getRuleName(ruleConfig);
    if (ruleName) {
      mergeRule(chainableModule.rule(ruleName), ruleConfig);
    } else if (ruleConfig.oneOf) {
      const chainableMainRule = chainableModule.rule('main');
      ruleConfig.oneOf.forEach((childRuleConfig, j) => {
        const childRuleName = getRuleName(childRuleConfig);
        // console.log('childRuleName => ', childRuleName);
        switch (childRuleName) {
          case 'babel':
            mergeRule(
              chainableMainRule.oneOf(
                childRuleConfig.exclude ? 'babel-outside' : 'babel'
              ),
              childRuleConfig
            );
            break;
          case 'postcss':
            mergeRule(
              chainableMainRule.oneOf(
                childRuleConfig.exclude ? 'postcss-module' : 'postcss'
              ),
              childRuleConfig
            );
            break;
          case 'sass':
            mergeRule(
              chainableMainRule.oneOf(
                childRuleConfig.exclude ? 'sass-module' : 'sass'
              ),
              childRuleConfig
            );
            break;
          default:
            mergeRule(
              chainableMainRule.oneOf(childRuleName, j),
              childRuleConfig
            );
        }
      });
    } else {
      mergeRule(chainableModule.rule(i), ruleConfig);
    }
  });
}

/**
 * 初始化 plugins 节点
 * @param {webpack-chain} webpackChain
 * @param {Object} pluginConfig
 */
function chainPlugins(webpackChain, pluginConfig) {
  pluginConfig.forEach((n, i) => {
    const { name } = n.constructor;
    webpackChain.plugin(
      nextName(webpackChain.plugins, name === 'Object' ? i : name)
    ).use(n);
  });
}

function getRuleName(rule) {
  const loader = rule.loader || getLastLoader(rule.use);
  return loader && loader.replace(/.+[/\\@]([a-z]+)-loader(?:\/|\\).+/, '$1');
}

function getLoaderName(rule) {
  return getLastLoader(rule).replace(
    /.+[/\\@]([a-z]+-loader)(?:\/|\\).+/,
    '$1'
  );
}

function mergeRule(chainableRule, ruleConfig) {
  chainableRule.merge(ruleConfig, ['use', 'test', 'include', 'exclude']);
  add(chainableRule.exclude, ruleConfig.exclude);
  add(chainableRule.include, ruleConfig.include);
  ruleConfig.test && chainableRule.test(ruleConfig.test);
  ruleConfig.use &&
    ruleConfig.use.forEach(loaderConfig =>
      chainableRule
        .use(getLoaderName(loaderConfig))[isObject(loaderConfig) ? 'merge' : 'loader'](loaderConfig)
    );
}

function getLastLoader(use) {
  const lastLoader = isArray(use) ? use[use.length - 1] : use;
  return isObject(lastLoader) ? lastLoader.loader : lastLoader;
}

function add(chainableSet, item) {
  if (item) {
    if (!isArray(item)) {
      item = [item];
    }
    item.forEach(n => chainableSet.add(n));
  }
}

function nextName(chainableMap, name) {
  if (chainableMap.has(name)) {
    const matched = name.match(/^(\S+)-(\d+)$/);
    return matched
      ? nextName(chainableMap, `${matched[1]}-${+matched[2] + 1}`)
      : `${name}-1`;
  }
  return name;
}

function clear(webpackConfig, props) {
  props.forEach((prop) => {
    const val = webpackConfig[prop] = [];
    if (isArray(val)) {
      webpackConfig[prop] = [];
    } else if (isObject(val)) {
      webpackConfig[prop] = {};
    }
  });
}
