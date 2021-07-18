import { Switch, Route, Redirect } from 'react-router';
import { createElement } from 'react';
import RouteView from 'react-route-guard/es/RouteView';
import objectWithoutProperties from 'celia/es/objectWithoutProperties';
import pathJoin from 'celia/es/pathJoin';
import { createName } from '../util/shared';

/**
 * 创建 Route 元素
 *
 * @param {string} parentName
 * @param {string} parentPath
 * @param {object} route
 * @param {object} ctx
 * @returns {React.ReactComponentElement}
 */
function createRoute(
  parentName,
  parentPath,
  route,
  ctx,
) {
  // 具名路由
  let { name } = route;
  if (!name) {
    name = `${parentName}.${createName()}`;
    route.name = name;
  }

  const { routeNameCheck } = ctx;
  if (routeNameCheck.hasOwnProperty(name)) {
    throw new Error(`Duplicate name: ${name}`);
  }
  routeNameCheck[name] = 1;

  // 解析过的配置，直接使用
  const { routeConfigCache } = ctx;
  const routeCache = routeConfigCache[name];
  if (routeCache) {
    return routeCache.render(routeCache.props, routeCache.children);
  }

  let { path } = route;
  if (!path) {
    throw new Error(`Missing path in named route ${name}`);
  }
  path = pathJoin(parentPath || '', path);

  const redirect = route.redirect || route.to;
  if (redirect) {
    const props = {
      key: name,
      exact: true,
      from: path,
      to: redirect
    };
    const render = function (props) {
      return createElement(Redirect, props); // 跳转路由
    };
    routeConfigCache[name] = { parentName, path, props, render };
    return render(props);
  }

  const routeConfig = objectWithoutProperties(route, [
    'to',
    'redirect',
    'component',
    'render',
    'children',
    'beforeEnter'
  ]);
  routeConfig.key = name;
  routeConfig.path = path;

  const { render, component, children, beforeEnter } = route;
  routeConfig.render = function (cprops) {
    cprops.route = routeConfig;

    let { beforeHooks } = ctx;
    if (typeof beforeEnter === 'function') {
      beforeHooks = beforeHooks.concat(beforeEnter);
    }

    // 如果没有配置钩子函数，就直接渲染组件
    return beforeHooks.length
      ? createElement(RouteView, {
        component,
        propsFromRoute: cprops,
        beforeHooks,
        afterHooks: ctx.afterHooks
      })
      : render
        ? render(cprops)
        : createElement(component, cprops);
  };

  const routeRender = function (props, routeChildren) {
    return !routeChildren || !routeChildren.length
      ? createElement(Route, props)
      : createElement(
        component,
        { key: `${name}-component`, route: props },
        createElement(
          Routes,
          {
            parentName: name,
            parentPath: path,
            routes: routeChildren,
            ctx,
            resetRouteNameCheck: true
          }
        )
      ); // 如果有子路由，先创建对应的组件，再递归创建 Route
  };
  // 缓存解析数据
  routeConfigCache[name] = {
    parentName,
    path,
    props: routeConfig,
    children,
    render: routeRender
  };
  return routeRender(routeConfig, children);
}

/**
 * 用于生成 Route 集合的组件
 *
 * @param {{ctx: object}} props
 * @returns {React.FC}
 */
export default function Routes({
  parentName,
  parentPath,
  routes,
  ctx,
  resetRouteNameCheck
}) {
  // 用于 route name 重名校验
  if (resetRouteNameCheck) {
    ctx.routeNameCheck = {};
  }

  return !routes.length // 没有子路由直接返回null
    ? null
    : createElement(
      Switch,
      null,
      routes.map((route) => {
        return createRoute(
          parentName,
          parentPath,
          route,
          ctx
        );
      })
    );
}
