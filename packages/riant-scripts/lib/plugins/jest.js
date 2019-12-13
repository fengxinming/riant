'use strict';

const { join } = require('path');
const { isObject, isString, forOwn } = require('../utils');

const { isArray } = Array;
const { assign } = Object;

/**
 * 处理自定义配置 alias
 *
 * @param {Service} service
 * @param {Object} projectOptions
 */
module.exports = function (service, projectOptions) {
  // 方便查看依赖的全局配置参数
  const { jest = config => config } = projectOptions;

  const { reactScriptVersion, reactScriptPath } = service;

  // 读取 paths 配置
  const pathsConfig = service.paths;
  const packageJson = require(pathsConfig.appPackageJson);

  // 读取 jest 配置
  const jestFromPackage = packageJson.jest;
  delete packageJson.jest;

  const createJestConfigPath = `${reactScriptVersion}/scripts/utils/createJestConfig`;
  const createJestConfig = require(createJestConfigPath);
  // 读取默认 jest 配置
  const defaultJestConfig = createJestConfig(
    relativePath => join(reactScriptPath, relativePath),
    join(pathsConfig.appSrc, '..'),
    false
  );
  packageJson.jest = jestFromPackage;

  // 合并 jest 配置
  Object.keys(defaultJestConfig.transform).forEach((key) => {
    if (defaultJestConfig.transform[key].endsWith('babelTransform.js')) {
      defaultJestConfig.transform[key] = join(__dirname, '..', '/utils/babel-transform.js');
    }
  });
  const jestConfig = assign({}, jestFromPackage);
  forOwn(jestConfig, (val, key) => {
    if (defaultJestConfig[key]) {
      if (isString(val)) {
        defaultJestConfig[key] = val;
      } else if (isArray(val)) {
        defaultJestConfig[key] = val.concat(defaultJestConfig[key]);
      } else if (isObject(val)) {
        defaultJestConfig[key] = assign({}, defaultJestConfig[key], val);
      }
    } else {
      defaultJestConfig[key] = val;
    }
  });

  // 缓存 jest 配置
  require.cache[require.resolve(createJestConfigPath)].exports = () => {
    let res = jest(defaultJestConfig);
    if (!isObject(res)) {
      res = defaultJestConfig;
    }
    return res;
  };
};
