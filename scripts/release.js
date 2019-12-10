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

const es5Packages = [
  'riant',
  'riant-scripts',
  'cra-template-riant'
];

publish(es5Packages, packageName => join(__dirname, '..', 'packages', packageName));
