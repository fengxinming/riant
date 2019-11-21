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
  chainResolve(chain.resolve, webpackConfig.resolve);
  webpackConfig.resolve.modules = [];
  webpackConfig.resolve.extensions = [];

  chainModule(chain.module, webpackConfig.module);
  webpackConfig.module = {};
};

function chainResolve(chainableResolve, resolveConfig) {
  chainableResolve.merge(resolveConfig, ['plugin']);
}

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
