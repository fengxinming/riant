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
  chainOptimization(chain.optimization, webpackConfig.optimization);
  webpackConfig.optimization.minimizer = [];
  webpackConfig.optimization.splitChunks = {};
  webpackConfig.optimization.runtimeChunk = {};

  chainResolve(chain.resolve, webpackConfig.resolve);
  webpackConfig.resolve.modules = [];
  webpackConfig.resolve.extensions = [];

  chainModule(chain.module, webpackConfig.module);
  webpackConfig.module = {};
};

/**
 * 初始化 optimization 节点
 * @param {webpack-chain} chainableOptimization
 * @param {Object} optimizationConfig
 */
function chainOptimization(chainableOptimization, optimizationConfig) {
  chainableOptimization.minimize(optimizationConfig.minimize);
  optimizationConfig.minimizer.forEach((n, i) => {
    const { name } = n.constructor;
    chainableOptimization
      .minimizer(name === 'Object' ? i : name)
      .use(n);
  });
  chainableOptimization.splitChunks(optimizationConfig.splitChunks);
  chainableOptimization.runtimeChunk(optimizationConfig.runtimeChunk);
}

/**
 * 初始化 resolve 节点
 * @param {webpack-chain} chainableResolve
 * @param {Object} resolveConfig
 */
function chainResolve(chainableResolve, resolveConfig) {
  chainableResolve.merge(resolveConfig, ['plugin']);
}

/**
 * 初始化 module 节点
 * @param {webpack-chain} chainableModule
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
        switch (childRuleName) {
          case 'babel':
            mergeRule(chainableMainRule.oneOf(childRuleConfig.exclude ? 'babel-outside' : 'babel'), childRuleConfig);
            break;
          case 'postcss':
            mergeRule(chainableMainRule.oneOf(childRuleConfig.exclude ? 'postcss-module' : 'postcss'), childRuleConfig);
            break;
          case 'sass':
            mergeRule(chainableMainRule.oneOf(childRuleConfig.exclude ? 'sass-module' : 'sass'), childRuleConfig);
            break;
          default:
            mergeRule(chainableMainRule.oneOf(childRuleName, j), childRuleConfig);
        }
      });
    } else {
      mergeRule(chainableModule.rule(i), ruleConfig);
    }
  });
}

function getRuleName(rule) {
  const loader = (rule.loader || getLastLoader(rule.use));
  return loader && loader.replace(/.+[/@]([a-z]+)-loader\/.+/, '$1');
}

function getLoaderName(rule) {
  return getLastLoader(rule).replace(/.+[/@]([a-z]+-loader)\/.+/, '$1');
}

function mergeRule(chainableRule, ruleConfig) {
  chainableRule.merge(ruleConfig, ['use', 'test', 'include', 'exclude']);
  add(chainableRule.exclude, ruleConfig.exclude);
  add(chainableRule.include, ruleConfig.include);
  ruleConfig.test && chainableRule.test(ruleConfig.test);
  ruleConfig.use && ruleConfig.use.forEach(loaderConfig =>
    chainableRule.use(getLoaderName(loaderConfig))[isObject(loaderConfig) ? 'merge' : 'loader'](loaderConfig));
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
