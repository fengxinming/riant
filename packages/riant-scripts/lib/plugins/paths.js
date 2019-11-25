'use strict';

const { isFunction, isObject } = require('../utils');

/**
 * 处理自定义配置 alias
 *
 * @param {Service} service
 * @param {Object} projectOptions
 */
module.exports = function (service, projectOptions) {
  // 方便查看依赖的全局配置参数
  const { paths } = projectOptions;

  const { reactScriptVersion } = service;
  // 加载环境配置文件
  require(`${reactScriptVersion}/config/env`);

  // 原 paths 配置
  const originalPaths = service.paths;

  if (isFunction(paths)) {
    const res = paths(originalPaths, process.env.NODE_ENV);
    if (isObject(res)) {
      // 缓存 paths
      service.paths = res;
    }
  } else if (isObject(paths)) {
    Object.assign(originalPaths, paths);
  }
};
