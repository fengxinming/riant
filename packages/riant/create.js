'use strict';

const { join } = require('path');
const prompts = require('prompts');
const { removeSync, existsSync, remove } = require('fs-extra');
const { getTemplate, getTmpdir, logger } = require('../index');

module.exports = async function (name, options, {
  templatePrompt,
  templateValidator
}) {
  const choice = await prompts(templatePrompt);
  const template = choice[templatePrompt.name];
  await templateValidator(template);

  const cwd = process.cwd();
  const dist = join(cwd, name);

  if (existsSync(dist)) {
    const { deletion } = await prompts({
      type: 'confirm',
      name: 'deletion',
      message: `目录 ${name} 已存在，是否删除该目录？`
    });
    if (deletion) {
      await remove(dist);
      logger.info(`目录 ${name} 已被删除`);
    }
    else {
      logger.error(`目录 ${name} 已存在`);
      return;
    }
  }

  try {
    await getTemplate({
      name,
      template,
      cwd,
      dist,
      npmClient: options.n
    });
  }
  catch (e) {
    if (e.message) {
      logger.error(e);
    }
  }
  finally {
    try {
      removeSync(getTmpdir());
    }
    catch (e) {
      logger.error('清理临时目录异常', e);
    }
  }
};
