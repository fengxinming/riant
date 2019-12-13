'use strict';

const Ajv = require('ajv');

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  $data: true
});
require('ajv-keywords')(ajv, ['instanceof', 'typeof']);

const compiledSchema = ajv.compile({
  title: 'RiantScriptsOptions',
  type: 'object',
  additionalProperties: false,
  properties: {
    alias: { instanceof: ['Function', 'Object'] },
    babelPlugins: { instanceof: ['Function', 'Array'] },
    chainWebpack: { instanceof: 'Function' },
    configureWebpack: { instanceof: 'Function' },
    css: {
      type: 'object',
      properties: {
        modules: { type: 'boolean' },
        sourceMap: { type: 'boolean' },
        loaderOptions: {
          type: 'object',
          properties: {
            css: { type: 'object' },
            less: { type: 'object' },
            stylus: { type: 'object' },
            postcss: { type: 'object' }
          }
        }
      }
    },
    devServer: { instanceof: ['Function', 'Object'] },
    extensions: { instanceof: ['Function', 'Array'] },
    externals: { instanceof: ['Function', 'Array', 'RegExp', 'Object'] },
    jest: { instanceof: ['Function', 'Object'] },
    paths: { instanceof: ['Function', 'Object'] },
    useEslintrc: { type: 'boolean' }
  }
});

exports.validate = function (resolved, cb) {
  const valid = compiledSchema(resolved);
  !valid && cb && cb(filterErrors(compiledSchema.errors));
};

exports.defaults = () => ({
  // multi-page config
  pages: undefined,

  css: {
    // modules: false,
    // sourceMap: false,
    // loaderOptions: {}
  },

  devServer: {
    /*
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: null, // string | Object
    before: app => {}
  */
  }
});

function filterErrors(errors) {
  let newErrors = [];

  for (const error of errors) {
    const { dataPath } = error;
    let children = [];

    newErrors = newErrors.filter((oldError) => {
      if (oldError.dataPath.includes(dataPath)) {
        if (oldError.children) {
          children = children.concat(oldError.children.slice(0));
        }

        // eslint-disable-next-line no-undefined, no-param-reassign
        oldError.children = undefined;
        children.push(oldError);

        return false;
      }

      return true;
    });

    if (children.length) {
      error.children = children;
    }

    newErrors.push(error);
  }

  return newErrors;
}
