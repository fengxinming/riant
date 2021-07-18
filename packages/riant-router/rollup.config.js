import buble from '@rollup/plugin-buble';
import empty from 'rollup-plugin-empty';
import copy from 'rollup-plugin-copy';
import replaceImports from 'rollup-plugin-replace-imports';

export default {
  input: 'src/index.js',
  external: [
    'react',
    'react-router',
    'history',
    /^react-route-guard/,
    /^celia/
  ],
  plugins: [
    empty({
      silent: false,
      dir: 'dist'
    }),
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' },
        { src: 'TNPM_README.md', dest: 'dist', rename: 'README.md' },
        { src: 'types/index.d.ts', dest: 'dist' }
      ]
    }),
    buble()
  ],
  output: [
    {
      dir: 'dist/es',
      format: 'es',
      exports: 'auto'
    },
    {
      dir: 'dist',
      format: 'cjs',
      exports: 'auto',
      plugins: [
        replaceImports((n) => n.replace('/es/', '/'))
      ]
    }
  ]
};
