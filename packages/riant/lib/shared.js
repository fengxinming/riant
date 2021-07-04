'use strict';

const { tmpdir, homedir } = require('os');
const { join } = require('path');
const { existsSync, readFileSync } = require('fs');
const execa = require('execa');
const logger = require('./logger');

const rcFile = join(homedir(), '.riantrc');

exports.getTmpdir = function () {
  return join(tmpdir(), '__riant__');
};

exports.getVersion = function (npmClient, moduleName) {
  return execa(npmClient, ['view', moduleName, 'version'])
    .then(({ stdout }) => stdout.trim())
    .catch((e) => {
      return Promise.reject(new Error(e.stderr));
    });
};

exports.getLocalPrompts = function (key) {
  // 读取本地资源配置
  if (existsSync(rcFile)) {
    try {
      const localConfig = JSON.parse(readFileSync(rcFile, 'utf8'));
      const localTemplates = localConfig[key];
      if (Array.isArray(localTemplates)) {
        return localTemplates;
      }
    }
    catch (e) {
      logger.warn(e);
    }
  }

  return [];
};
