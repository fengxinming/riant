'use strict';

const { checkForLatestVersion } = require('../index');
const { getLocalPrompts } = require('../lib/shared');
const create = require('../lib/create');

const TEMPLATES = [
  { title: '本地控制台', value: 'riant-template-console' }
];

module.exports = async function (appName, options) {
  await checkForLatestVersion(options.n);

  await create(appName, options, {
    templatePrompt: {
      type: 'select',
      name: 'template',
      message: '请选择模板',
      choices: TEMPLATES.concat(getLocalPrompts('templates'))
    },
    templateValidator(value) {
      if (!value) {
        throw new Error('未选择模板\n');
      }
    }
  });
};
