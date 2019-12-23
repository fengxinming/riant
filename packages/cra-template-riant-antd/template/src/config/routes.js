import BasicLayout from '~/layouts/BasicLayout';
import NotFound from '~/pages/NotFound';

const Home = () => import('~/pages/Home');
const Form = () => import('~/pages/Form');
const List = () => import('~/pages/List');

const routerConfig = [
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/home',
        componentAsync: Home
      },
      {
        path: '/form',
        componentAsync: Form
      },
      {
        path: '/list',
        componentAsync: List
      },
      {
        path: '/',
        redirect: '/home'
      },
      {
        path: '*',
        component: NotFound
      }
    ]
  }
];

export default routerConfig;
