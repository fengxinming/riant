# riant
Highly configurable development and build tools for react.

---

## Creating an App

### Installing template

```bash
# npm 5.2+
npx create-react-app my-app --template riant
# npm 6+
npm init react-app my-app --template riant
# Yarn 0.25+
yarn create react-app my-app --template riant
```

### Start the Dev Server

```bash
cd my-app
npm start
```

| Template | Version | Docs | Usage |
| ------- | ------- | ---- | ----------- |
| [`riant`](packages/cra-template-riant) | [![npm](https://img.shields.io/npm/v/cra-template-riant.svg?style=flat-square)](https://www.npmjs.com/package/cra-template-riant) | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](packages/cra-template-riant#readme) | npm init react-app my-app --template riant |
| [`riant-antd`](packages/cra-template-riant-antd) | [![npm](https://img.shields.io/npm/v/cra-template-riant-antd.svg?style=flat-square)](https://www.npmjs.com/package/cra-template-riant-antd) | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](packages/cra-template-riant-antd#readme) | npm init react-app my-app --template riant-antd |
| [`riant-order-management`](packages/cra-template-riant-order-management) | [![npm](https://img.shields.io/npm/v/cra-template-riant-order-management.svg?style=flat-square)](https://www.npmjs.com/package/cra-template-riant-order-management) | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](packages/cra-template-riant-order-management#readme) | npm init react-app my-app --template riant-order-management |

---

## Configuring an Existing App

[Documentation](packages/riant-scripts/README.md)

| Package | Version | Docs | Description |
| ------- | ------- | ---- | ----------- |
| [`riant-scripts`](packages/riant-scripts) | [![npm](https://img.shields.io/npm/v/riant-scripts.svg?style=flat-square)](https://www.npmjs.com/package/riant-scripts) | [![](https://img.shields.io/badge/API%20Docs-markdown-lightgrey.svg?style=flat-square)](packages/riant-scripts#readme) | Base on [react-scripts](https://github.com/facebook/create-react-app/tree/master/packages/react-scripts) |