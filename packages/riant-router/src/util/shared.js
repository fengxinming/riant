import noop from 'celia/es/noop';
import forEach from 'celia/es/forEach';

export const inBrowser = typeof window !== 'undefined';

export const supportsPushState = inBrowser && (function () {
  const ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1)
    && ua.indexOf('Mobile Safari') !== -1
    && ua.indexOf('Chrome') === -1
    && ua.indexOf('Windows Phone') === -1
  ) {
    return false;
  }

  return window.history && 'pushState' in window.history;
})();

export function registerHook(hooks, fn) {
  if (typeof fn !== 'function') {
    return noop;
  }
  hooks.push(fn);
  return () => {
    const i = hooks.indexOf(fn);
    if (i > -1) {
      hooks.splice(i, 1);
    }
  };
}

export function createName() {
  return Math.random().toString(36).slice(2);
}

export function arrayDeletes(array, callback) {
  let index = -1;
  forEach(array, (n, i) => {
    if (callback(n, i, array)) {
      index = i;
      return false;
    }
  });
  if (index > -1) {
    return array.splice(index, 1)[0];
  }
  return null;
}
