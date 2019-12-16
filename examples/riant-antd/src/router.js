import { createElement } from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { createHashHistory } from 'history';
import loadable from '@loadable/component';
import { Spin } from 'antd';
import joinPath from 'celia/joinPath';
import routes from '~/config/routes';

const history = createHashHistory();

const loadableOptions = {
  fallback: createElement(Spin, { tip: 'Loading...' })
};

function createRouteItem({ redirect, ...others }) {
  return redirect
    ? createElement(Redirect, {
        exact: true,
        key: others.key,
        from: others.path,
        to: redirect
      })
    : createElement(Route, others);
}

function createRoute(ReactComponent, props, routes, parentRoute) {
  return createElement(
    ReactComponent,
    props,
    routes
      ? createElement(
          Switch,
          null,
          routes.map(
            (
              { path, component, componentAsync, children, ...others },
              routeIndex
            ) => {
              const rkey = others.key || `${parentRoute.key}.${routeIndex}`;
              const rckey = `component-${rkey}`;
              const RouteComponent = componentAsync
                ? loadable(componentAsync, loadableOptions)
                : component;

              others.key = rkey;
              others.path = path && joinPath(parentRoute.path || '', path);

              if (children) {
                others.render = function(props) {
                  return createRoute(
                    RouteComponent,
                    { key: rckey, ...props },
                    children,
                    others
                  );
                };
              } else {
                others.component = RouteComponent;
              }
              return createRouteItem(others);
            }
          )
        )
      : null
  );
}

export default function() {
  return createRoute(Router, { history }, routes, { key: 'route' });
}
