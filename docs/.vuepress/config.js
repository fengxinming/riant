module.exports = {
  dest: '../gh-pages',
  base: '/riant/',
  port: 5000,
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Riant',
      description: 'Highly configurable development and build tools for react.'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Riant',
      description: '可配置化的React开发和构建工具'
    }
  },
  themeConfig: {
    logo: 'https://react-redux.js.org/img/redux_white.svg',
    repo: 'fengxinming/riant',
    smoothScroll: true,
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        ariaLabel: 'Language Menu',
        // nav: require('./nav/zh-CN'),
        // sidebar: require('./sidebar/zh-CN')
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        ariaLabel: '语言菜单',
        // nav: require('./nav/zh-CN'),
        // sidebar: require('./sidebar/zh-CN')
      }
    }
  }
};