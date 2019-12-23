import './css/index.styl';
import * as serviceWorker from './serviceWorker';
import { ConfigProvider } from 'antd';
import ReactDOM from 'react-dom';
import { createElement } from 'react';
import router from './router';
import zhCN from 'antd/es/locale/zh_CN';

ReactDOM.render(
  createElement(ConfigProvider, { locale: zhCN }, router()),
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
