'use strict';

const { getLogger } = require('clrsole');
const pkg = require('../../package.json');

Object.assign(exports, require('celia'));

exports.defaultsDeep = require('lodash/defaultsDeep');

exports.getLogger = function (name, options) {
  return getLogger(`${pkg.name}.${name}`, options);
};
