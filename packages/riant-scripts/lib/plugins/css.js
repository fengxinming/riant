'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssNormalize = require('postcss-normalize');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

/**
 * 添加css相关插件
 *
 * @param {Service} service
 * @param {Object} projectOptions
 */
module.exports = function (service, projectOptions) {
  service.chainWebpack(function (chain, webpackEnv) {
    // 方便查看依赖的全局配置参数
    const { css } = projectOptions;

    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';
    const { paths } = service;
    const publicPath = isEnvProduction
      ? paths.servedPath
      : isEnvDevelopment && '/';
    const shouldUseRelativeAssetPaths = publicPath === './';
    const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

    const {
      sourceMap = isEnvProduction && shouldUseSourceMap,
      loaderOptions = {}
    } = css || {};

    const postcssOptions = Object.assign({
      // https://github.com/facebook/create-react-app/issues/2677
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        }),
        postcssNormalize()
      ],
      sourceMap
    }, loaderOptions.postcss);

    const mainRuleChain = chain.module.rule('main');

    function applyLoaders(rule, cssOptions, loader, options) {
      isEnvDevelopment
        ? rule
          .use('style-loader')
          .loader(require.resolve('style-loader'))
        : rule
          .use('extract-css-loader')
          .loader(MiniCssExtractPlugin.loader)
          .options(shouldUseRelativeAssetPaths ? { hmr: isEnvDevelopment, publicPath: '../../' } : {});

      rule
        .use('css-loader')
        .loader(require.resolve('css-loader'))
        .options(cssOptions);

      rule
        .use('postcss-loader')
        .loader(require.resolve('postcss-loader'))
        .options(postcssOptions);

      rule
        .use(loader)
        .loader(require.resolve(loader))
        .options(Object.assign({ sourceMap }, options));
    }

    function createCSSRule(lang, test, loader, options) {
      const cssRegex = new RegExp(test);
      const cssModuleRegex = new RegExp(`\\.module${test}`);

      // 通用 css 导入规则
      applyLoaders(
        mainRuleChain
          .oneOf(lang)
          .before('file')
          .test(cssRegex)
          .sideEffects(true)
          .exclude
          .add(cssModuleRegex)
          .end(),
        Object.assign({
          sourceMap,
          importLoaders: 2
        }, loaderOptions.css),
        loader, options
      );

      // *.module.* 文件规则
      applyLoaders(
        mainRuleChain
          .oneOf(`${lang}-module`)
          .before('file')
          .test(cssModuleRegex),
        Object.assign({
          importLoaders: 2,
          sourceMap,
          modules: true,
          getLocalIdent: getCSSModuleLocalIdent
        }, loaderOptions.css),
        loader, options);
    }

    // 安装 less less-loader 模块即可支持解析 less 文件
    try {
      require.resolve('less-loader');
      createCSSRule('less', '\\.less$', 'less-loader', loaderOptions.less);
    } catch (e) { }

    // 安装 stylus stylus-loader 模块即可支持解析 stylus 文件
    try {
      require.resolve('stylus-loader');
      createCSSRule('stylus', '\\.styl(us)?$', 'stylus-loader', Object.assign({
        preferPathResolver: 'webpack'
      }, loaderOptions.stylus));
    } catch (e) { }
  });
};
