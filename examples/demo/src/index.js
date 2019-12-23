import './css/index.styl';
import * as serviceWorker from './serviceWorker';
import ReactDOM from 'react-dom';
import router from './router';
import { sayHi } from './common/utils';

sayHi();

ReactDOM.render(router(), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
