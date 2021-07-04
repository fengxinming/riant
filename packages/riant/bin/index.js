#!/usr/bin/env node

const cac = require('cac');
const logger = require('../lib/logger');
const pkg = require('../package.json');

const cli = cac(pkg.name);

// 支持 -v -h 可选项提示
cli
  .version(pkg.version)
  .help((sections) => {
    sections[sections.length - 1] = {
      title: 'Options',
      body: `  -v, --version  显示版本号 
  -h, --help     显示帮助信息 `
    };
  });

// 支持 create 命令
cli
  .command('create <app-name>', '创建一个控制台项目')
  .option('-n, --npm-client', 'npm客户端，如：npm, tnpm, cnpm, yarn, pnpm等', {
    default: 'tnpm'
  })
  .action((appName, options) => {
    require('./create')(appName, options)
      .catch((e) => {
        logger.error(e);
      });
  });

// 支持 component 命令
cli
  .command('component <component-name>', '创建一个组件')
  .option('-n, --npm-client', 'npm客户端，如：npm, tnpm, cnpm, yarn, pnpm等', {
    default: 'tnpm'
  })
  .action((componentName, options) => {
    require('./component')(componentName, options)
      .catch((e) => {
        logger.error(e);
      });
  });

try {
  cli.parse();
}
catch (e) {
  if (e.name === 'CACError') {
    cli.outputHelp();
  }
  else {
    throw e;
  }
}

if (cli.rawArgs.length === 2) {
  cli.outputHelp();
}
