const { join } = require('path');
const {
  readdirSync,
  readFileSync,
  writeFile,
  copy,
  emptyDirSync
} = require('fs-extra');
const forOwn = require('celia/forOwn');

function resolveExamples(...args) {
  return join(__dirname, '..', 'examples', ...args);
}

function resolvePackages(...args) {
  return join(__dirname, '..', 'packages', ...args);
}

const { stringify, parse } = JSON;

readdirSync(resolveExamples()).forEach(dir => {
  const { templateName, template, dependencies } = parse(
    readFileSync(resolveExamples(dir, 'package.json'), 'utf8')
  );
  if (templateName && template) {
    emptyDirSync(resolvePackages(templateName, 'template'));

    dependencies['riant-scripts'] = '^1.1.4';

    writeFile(
      resolvePackages(templateName, 'template.json'),
      stringify(
        {
          dependencies,
          scripts: {
            start: 'riant-scripts start',
            build: 'riant-scripts build',
            test: 'riant-scripts test'
          }
        },
        null,
        2
      )
    );
    forOwn(template, (val, key) =>
      copy(resolveExamples(dir, key), resolvePackages(templateName, val))
    );
  }
});
