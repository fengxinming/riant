import isObject from 'celia/es/isObject';
import warn from 'celia/es/warn';
import { arrayDeletes, createName, registerHook } from './util/shared';
import { createHistory, createHistoryBy } from './lib/history';
import { createGuard } from './lib/guard';
import { createRouter } from './lib/router';
export * from './util/shared';

const { isArray } = Array;

function findByName(routes, name, callback) {
  let route = null;
  let currentIndex = -1;
  let parentRoute = null;
  for (let i = 0, len = routes.length; i < len; i++) {
    const tmp = routes[i];
    if (tmp.name === name) {
      route = tmp;
      currentIndex = i;
      break;
    }
    else {
      const { children } = tmp;
      if (children) {
        // eslint-disable-next-line no-loop-func
        findByName(children, name, (route2, currentIndex2, parentRoute2) => {
          route = route2;
          currentIndex = currentIndex2;
          parentRoute = tmp;
        });
        if (!route) {
          break;
        }
      }
    }
  }
  callback(route, currentIndex, parentRoute);
}

function pushRoutes(parentRoute, newRoutes) {
  const { children } = parentRoute;
  if (!children) {
    parentRoute.children = newRoutes;
  }
  else {
    children.push(...newRoutes);
  }
}

/**
 * 创建上下文
 * @param {object} config
 * @returns {object}
 */
function createContext(config) {
  const ctx = Object.create(null);

  // 导航前的钩子函数队列
  ctx.beforeNavigationHooks = [];

  // 渲染前的钩子函数队列
  ctx.beforeHooks = [];

  // 渲染后的钩子函数队列
  ctx.afterHooks = [];

  // 路由配置
  ctx.routes = config.routes || [];

  // 路由根节点名称
  ctx.routerName = `router-${createName()}`;

  // route 属性缓存
  ctx.routeConfigCache = Object.create(null);

  // history 实例
  ctx.history = createHistory(config, ctx);

  // guard 实例
  ctx.guard = createGuard(ctx);

  return ctx;
}

/**
 * 创建react路由
 * @param {object} config
 * @returns {object}
 */
export function create(config = {}) {
  const ctx = createContext(config);

  return {
    history: ctx.guard,

    /**
     * 全局钩子，真正变更路由前触发，可以在此中断路由变更
     *
     * @param {function} fn 钩子函数
     * @returns {function} 卸载函数
     */
    beforeNavigate(fn) {
      return registerHook(ctx.beforeNavigationHooks, fn);
    },

    /**
     * 全局钩子，每匹配到一个路由在渲染组件之前触发
     *
     * @param {function} fn 钩子函数
     * @returns {function} 卸载函数
     */
    beforeEach(fn) {
      return registerHook(ctx.beforeHooks, fn);
    },

    /**
     * 全局钩子，路由组件更新完成后触发
     *
     * @param {function} fn 钩子函数
     * @returns {function} 卸载函数
     */
    afterEach(fn) {
      return registerHook(ctx.afterHooks, fn);
    },

    /**
     * 在指定路由节点下追加子路由
     *
     * @param {string} name
     * @param {object[]|object} route
     */
    addRoute(name, route) {
      if (isObject(name)) {
        route = name;
        name = null;
      }

      if (!isObject(route)) {
        warn('Could not add non-object as route config');
        return;
      }

      if (!isArray(route)) {
        route = [route];
      }
      else if (!route.length) {
        warn('Could not add empty array as route config');
        return;
      }

      if (!name) {
        ctx.routes.push(...route);
      }
      else {
        const { routeConfigCache } = ctx;
        const cache = routeConfigCache[name];
        // 已经被解析过
        if (cache) {
          pushRoutes(cache, route);
        }
        else { // 可能 name 不存在，或者未解析过
          findByName(ctx.routes, name, (foundRoute) => {
            if (!foundRoute) {
              warn(`Unknown name: ${name}`);
              return;
            }
            pushRoutes(foundRoute, route);
          });
        }
      }
    },

    /**
     * 在指定路由节点下删除子路由
     *
     * @param {string} name
     */
    deleteRoute(name) {
      if (!name) {
        warn('Missing name before deleting route');
        return;
      }

      const { routeConfigCache, routes } = ctx;
      const cache = routeConfigCache[name];
      // 可能 name 不存在，或者未解析过
      if (!cache) {
        findByName(routes, name, (foundRoute, index, parentRoute) => {
          if (!foundRoute) {
            warn(`Unknown name: ${name}`);
            return;
          }
          const routeChildren = parentRoute ? parentRoute.children : routes;
          routeChildren.splice(index, 1);
        });
      }
      else {
        const { parentName } = cache;
        arrayDeletes(
          parentName === ctx.routerName
            ? routes
            : routeConfigCache[parentName].children || [],
          (n) => n.name === name
        );
      }
    },

    /**
     * 全局路由组件
     *
     * @returns {React.ReactComponentElement}
     */
    Router: createRouter(ctx)
  };
}

export { createHistoryBy };
