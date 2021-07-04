'use strict';

const { checkForLatestVersion } = require('../index');
const { getLocalPrompts } = require('../lib/shared');
const create = require('../lib/create');

const COMPONENTS = [

];

module.exports = async function (componentName, options) {
  await checkForLatestVersion(options.n);

  await create(componentName, options, {
    templatePrompt: {
      type: 'select',
      name: 'component',
      message: '请选择组件',
      choices: COMPONENTS.concat(getLocalPrompts('components'))
    },
    templateValidator(value) {
      if (!value) {
        throw new Error('未选择组件\n');
      }
    }
  });
};
