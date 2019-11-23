'use strict';

const { EOL } = require('os');
const Service = require('./lib/Service');
const { logWithSpinner, stopSpinner } = require('./lib/spinner');
const pkg = require('./package.json');

module.exports = function (command, options = {}) {
  logWithSpinner(`${pkg.name} is running ...${EOL}`);

  let plugins = [
    require('./lib/plugins/paths'),
    require('./lib/plugins/alias'),
    require('./lib/plugins/babel-plugins'),
    require('./lib/plugins/css'),
    require('./lib/plugins/extensions'),
    require('./lib/plugins/externals'),
    require('./lib/plugins/chain-webpack'),
    require('./lib/plugins/configure-webpack')
  ];

  switch (command) {
    case 'start':
      plugins.push(require('./lib/plugins/dev-server'));
      break;
    case 'test':
      plugins.push(require('./lib/plugins/jest'));
      break;
  }

  if (Array.isArray(options.plugins)) {
    plugins = plugins.concat(options.plugins);
  }
  options.plugins = plugins;

  const service = new Service(options);

  stopSpinner(false);
  service.run(command);
};
