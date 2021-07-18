import { Router as ReactRouter } from 'react-router';
import { createElement } from 'react';
import Routes from '../components/Routes';

/**
 * 创建 Router 组件
 *
 * @param {object} ctx
 * @returns {React.FC}
 */
export function createRouter(ctx) {
  return function Router(props) {
    return createElement(
      ReactRouter,
      { history: ctx.guard, staticContext: props.staticContext },
      createElement(
        Routes,
        {
          parentName: ctx.routerName,
          parentPath: '',
          routes: ctx.routes,
          ctx,
          resetRouteNameCheck: true
        }
      )
    );
  };
}
