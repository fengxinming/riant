'use strict';

const chalk = require('chalk');
const { format } = require('util');
const { name } = require('../package.json');

function print(style, args) {
  // eslint-disable-next-line no-console
  console.log(style.apply(style, args.map((n) => format(n))));
}
const logger = {};
[
  ['info', 'green'],
  ['error', 'red'],
  ['warn', 'yellow']
].forEach(([level, color]) => {
  logger[level] = function () {
    // eslint-disable-next-line prefer-rest-params
    print(chalk[color], [name, level.toUpperCase(), ...arguments]);
    return logger;
  };

  logger[color] = function (...args) {
    print(chalk[color], args);
    return logger;
  };
});

module.exports = logger;
