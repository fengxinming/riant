#!/usr/bin/env node

const { EOL } = require('os');
const program = require('commander');
const { clrsole } = require('clrsole');
const scripts = require('../index');
const pkg = require('../package.json');

program
  .command('start')
  .description('The page will automatically reload if you make changes to the code.')
  .option('-c, --config <path>', 'Specify a custom config file.')
  .option('-v, --react-script-version <react-scripts>', 'Specify custom "react-scripts".')
  .action(function () {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    scripts('start');
  });

program
  .command('build')
  .description('Builds the app for production to the build folder.')
  .option('-c, --config <path>', 'Specify a custom config file.')
  .option('-v, --react-script-version <react-scripts>', 'Specify custom "react-scripts".')
  .action(function () {
    process.env.NODE_ENV = 'production';
    scripts('build');
  });

program
  .command('test')
  .description('Runs the test watcher in an interactive mode.')
  .action(function () {
    process.env.NODE_ENV = process.env.NODE_ENV || 'test';
    scripts('test');
  });

program
  .name(pkg.name)
  .usage('<command> [options]');

program.on('--help', function () {
  clrsole.greenBright(`${EOL}Examples:
  $ ${pkg.name} start
  $ ${pkg.name} start -c custom.config.js
  $ ${pkg.name} start -h
  $ ${pkg.name} test
  $ ${pkg.name} build
`);
});

// 未知命令
program.on('command:*', function () {
  clrsole.redBright(`Invalid command: ${program.args.join(' ')}${EOL}`);
  program.outputHelp();
  process.exit(1);
});

program.parse(process.argv);

if (!program.args.length) {
  program.outputHelp();
}
