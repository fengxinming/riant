import { parsePath } from 'history';
import { generatePath } from 'react-router';
import stringifyQuery from 'fast-qs/es/stringify';

/**
 * 创建导航方法
 *
 * @param {string} method
 * @param {History} history
 * @param {object} routeConfigCache
 * @returns {function}
 */
function createNav(method, history, routeConfigCache) {
  return function (path, state) {
    return history[method](
      processTarget(path, method, routeConfigCache),
      state
    );
  };
}

/**
 * 处理push/replace参数包含name的情况
 *
 * @param {string|object} obj
 * @param {string} method
 * @param {object} routeConfigCache
 * @returns
 */
function processTarget(obj, method, routeConfigCache) {
  if (typeof obj === 'string') {
    obj = parsePath(obj);
  }
  else {
    const { query, params } = obj;

    if (query) {
      obj.search += (obj.search ? '&' : '') + stringifyQuery(query);
    }

    let pathname;
    const name =  obj.name;
    if (name) {
      const cache = routeConfigCache[name];
      if (cache && (pathname = cache.path) && params) {
        pathname = generatePath(pathname, params);
      }
    }
    else {
      pathname = obj.pathname;
    }
    obj.pathname = pathname;
  }

  obj.replace = method === 'replace';
  return obj;
}

/**
 * 创建要导出的navigation对象，跟history保持相同的api
 *
 * @param {object} ctx
 * @returns {object}
 */
export function createGuard(ctx) {
  const { history, routeConfigCache } = ctx;
  const guard = {};
  Object.keys(history).forEach((key) => {
    if (typeof history[key] === 'function') {
      guard[key] = history[key];
    }
    else {
      Object.defineProperty(guard, key, {
        enumerable: true,
        configurable: true,
        get() {
          return history[key];
        }
      });
    }
  });
  guard.push = createNav('push', history, routeConfigCache);
  guard.replace = createNav('replace', history, routeConfigCache);
  guard.back = guard.goBack;
  guard.forward = guard.goForward;

  return guard;
}
