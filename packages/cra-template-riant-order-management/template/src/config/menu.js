const navConfig = [
  {
    name: '反馈',
    path: 'https://github.com/react-hobby/riant/issues',
    external: true,
    icon: 'message'
  },
  {
    name: '帮助',
    path: 'https://github.com/react-hobby/riant',
    external: true,
    icon: 'question-circle'
  },
  {
    name: '退出',
    path: '/user/login',
    icon: 'user'
  }
];

const asideConfig = [
  {
    name: '工作台',
    path: '/dashboard',
    icon: 'home'
  },
  {
    name: '订单报表',
    path: '/order/report',
    icon: 'bar-chart'
  },
  {
    name: '订单管理',
    path: '/order/list',
    icon: 'shopping-cart'
  },
  {
    name: '退单管理',
    path: '/chargeback',
    icon: 'ordered-list'
  },
  {
    name: '发货管理',
    path: '/dispatch',
    icon: 'clock-circle'
  },
  {
    name: '商品管理',
    path: '/goods',
    icon: 'shopping-cart'
  },
  {
    name: '添加商品',
    path: '/add/goods',
    icon: 'form'
  },
  {
    name: '添加订单',
    path: '/add/order',
    icon: 'edit'
  }
];

export { navConfig, asideConfig };
