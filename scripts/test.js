'use strict';

const { join } = require('path');
const { exec } = require('./util');

const cwd = process.cwd();

function test(arr, getDir) {
  arr.forEach(
    (packageName) => {
      if (name && name !== packageName) {
        return;
      }
      process.chdir(getDir(packageName));
      exec(['run', 'test', ...args], true);
    }
  );
}
const [, , name, ...args] = process.argv;
const packages = [
];

const nodePackages = [
  'react-scripts-kyo'
];

test(packages, packageName => join(__dirname, '..', 'packages', packageName));
test(nodePackages, packageName => join(__dirname, '..', 'node-packages', packageName));

process.chdir(cwd);
