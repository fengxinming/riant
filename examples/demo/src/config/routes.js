import BasicLayout from '~/layouts/BasicLayout';
import NotFound from '~/pages/NotFound';

const Home = () => import('~/pages/Home');
const Form = () => import('~/pages/Form');

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
