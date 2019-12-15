const { join } = require('path');
const {
  readdirSync,
  readFileSync,
  writeFile,
  copy,
  emptyDirSync
} = require('fs-extra');

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

    delete dependencies.react;
    delete dependencies['react-dom'];
    delete dependencies['react-scripts'];

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
    Object.keys(template).forEach(key => {
      copy(
        resolveExamples(dir, key),
        resolvePackages(templateName, template[key])
      );
    });
  }
});
