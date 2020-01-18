'use strict';

const { existsSync } = require('fs');
const { isAbsolute, relative, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { isObject, isString, forOwn } = require('../utils');

function normalizePageConfig(c) {
  return isString(c) ? { entry: c } : c;
}

function ensureRelative(outputDir, _path) {
  if (isAbsolute(_path)) {
    return relative(outputDir, _path);
  } else {
    return _path;
  }
}

const { isArray } = Array;

/**
 * 处理自定义配置 pages
 *
 * @param {Service} service
 * @param {Object} projectOptions
 */
module.exports = function (service, projectOptions) {
  service.chainWebpack(function (chain, webpackEnv) {
    // 方便查看依赖的全局配置参数
    const { pages } = projectOptions;

    const { appPublic } = service.paths;
    const outputDir = service.paths.appBuild;
    const defaultTemplate = service.paths.appHtml;

    if (isObject(pages)) {
      const defaultHtmlOptions = chain
        .plugin('HtmlWebpackPlugin')
        .get('plugin')
        .options;

      forOwn(pages, (page, name) => {
        const pageConfig = normalizePageConfig(page);
        const {
          entry,
          template = join(appPublic, `${name}.html`),
          filename = `${name}.html`,
          chunks = [name]
        } = pageConfig;

        const customHtmlOptions = {};
        for (const key in pageConfig) {
          if (!['entry', 'template', 'filename', 'chunks'].includes(key)) {
            customHtmlOptions[key] = pageConfig[key];
          }
        }

        let entries = isArray(entry) ? entry : [entry];
        entries = entries.map((e) => service.resolve(e));
        if (webpackEnv === 'development') {
          entries.unshift(
            require.resolve('react-dev-utils/webpackHotDevClient')
          );
        }
        chain
          .entry(name)
          .merge(entries);

        const hasSpecifiedTemplate = existsSync(service.resolve(template));
        const templatePath = hasSpecifiedTemplate
          ? template
          : defaultTemplate;

        const pageHtmlOptions = Object.assign(
          {},
          defaultHtmlOptions,
          {
            chunks,
            template: templatePath,
            filename: ensureRelative(outputDir, filename)
          },
          customHtmlOptions
        );

        chain
          .plugin(`html-${name}`)
          .after('noop')
          .use(new HtmlWebpackPlugin(pageHtmlOptions));
      });

      chain.plugins.delete('HtmlWebpackPlugin');

      if (webpackEnv === 'development') {
        const filename = chain.output.get('filename');
        const index = filename.lastIndexOf('/');
        chain.output
          .filename(`${filename.slice(0, index)}/[name].${filename.slice(index + 1)}`);
      }
    }
  });
};
