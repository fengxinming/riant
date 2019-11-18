'use strict';

const { join } = require('path');
const { exec } = require('./util');

function publish(arr, getDir) {
  arr.forEach(
    (packageName) => {
      if (name && name !== packageName) {
        return;
      }
      exec(['publish', getDir(packageName), ...args], true);
    }
  );
}

const [, , name, ...args] = process.argv;

const es6packages = [
];

const es5Packages = [
  'riant',
  'riant-scripts'
];

publish(es6packages, packageName => join(__dirname, '..', 'packages', packageName, 'npm'));
publish(es5Packages, packageName => join(__dirname, '..', 'packages', packageName));
