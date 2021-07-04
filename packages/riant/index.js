'use strict';

const { join, isAbsolute } = require('path');
const { outputFile, removeSync } = require('fs-extra');
const execa = require('execa');
const ora = require('ora');
const semver = require('semver');
const prompts = require('prompts');
const logger = require('./lib/logger');
const { getTmpdir, getVersion } = require('./lib/shared');
const pkg = require('./package.json');

const spinner = ora();
async function getTemplate({ name, cwd, dist, template, version, npmClient }) {
  const tmpdir = getTmpdir();

  // 匹配本地模板
  if (template.startsWith('file:')) {
    template = template.slice(5);
    if (!isAbsolute(template)) {
      template = join(cwd, template);
    }
    const ret = await require(template)({
      name,
      cwd,
      dist
    });
    return ret;
  }

  spinner.start(`开始下载模板 ${template}`);
  const pkg = {
    dependencies: {
      [template]: version || '*'
    }
  };

  try {
    try {
      await outputFile(join(tmpdir, 'package.json'), JSON.stringify(pkg, null, 2));
      await execa(npmClient, ['install'], {
        cwd: tmpdir
      });
      spinner.succeed(`下载模板 ${template} 结束`);
    }
    catch (e) {
      spinner.fail('下载模板失败');
      if (e.stderr) {
        throw new Error(e.stderr);
      }
      throw e;
    }
    const ret = await require(join(tmpdir, 'node_modules', template))({
      name,
      cwd,
      dist: join(cwd, name)
    });
    return ret;
  }
  finally {
    removeSync(tmpdir);
  }
}

async function checkForLatestVersion(npmClient) {
  const moduleName = pkg.name;
  const latestVersion = await getVersion(npmClient, moduleName);
  const currentVersion = pkg.version;
  if (latestVersion && semver.lt(currentVersion, latestVersion)) {
    const err = new Error(`${moduleName} 的当前版本 ${currentVersion} 低于latest版本 ${latestVersion}`);

    const { canGo } = await prompts({
      type: 'confirm',
      name: 'canGo',
      message: `你正在运行 ${err.message}，是否继续？`
    });
    if (!canGo) {
      return Promise.reject(err);
    }
  }
}

module.exports = {
  logger,
  checkForLatestVersion,
  getTmpdir,
  getTemplate
};
