# cra-template-riant-antd

## Creating an App

You’ll need to have Node 8.16.0 or Node 10.16.0 or later version on your local development machine (but it’s not required on the server). You can use [nvm](https://github.com/nvm-sh/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects.

To create a new app, you may choose one of the following methods:

### npx

```bash
npx create-react-app my-app --template riant-antd
cd my-app
npm start
```

### npm
```bash
npm init react-app my-app --template riant-antd
cd my-app
npm start
```

### yarn
```bash
yarn create react-app my-app --template riant-antd
cd my-app
npm start
```

It will create a directory called my-app inside the current folder.
Inside that directory, it will generate the initial project structure and install the transitive dependencies:

```
my-app
  ├── README.md
  ├── node_modules
  ├── package.json
  ├── jsconfig.json
  ├── riant.config.js
  ├── .eslintrc
  ├── .gitignore
  ├── .env.production
  ├── public
  │   ├── favicon.ico
  │   ├── index.html
  │   └── manifest.json
  └── src
      ├── commons
      ├── components
      ├── config
      ├── hooks
      ├── layouts
      ├── mock
      ├── pages
      ├── styles
      ├── index.js
      ├── router.js
      ├── serviceWorker.js
      ├── setupProxy.js
      └── setupTests.js
```