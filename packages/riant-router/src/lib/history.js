import callHook from 'celia/es/callHook';
import runQueue from 'celia/es/runQueue';
import objectWithoutProperties from '@ali/iot-cloud-util/es/objectWithoutProperties';
import { createHashHistory, createBrowserHistory, createMemoryHistory } from 'history';
import { supportsPushState } from '../util/shared';

/**
 * 根据 mode 创建 history 实例
 *
 * @param {string} mode
 * @param {string} historyOptions
 * @returns {History}
 */
export function createHistoryBy(mode, historyOptions) {
  switch (mode) {
    case 'hash':
      return createHashHistory(historyOptions);
    case 'history':
      return createBrowserHistory(historyOptions);
    case 'memory':
      return createMemoryHistory(historyOptions);
    default:
      throw new Error(`invalid mode: ${mode}`);
  }
}

/**
 * 创建 history 实例
 *
 * @param {object} config
 * @param {object} ctx
 * @returns {History}
 */
export function createHistory(config, ctx) {
  const { mode } = config;
  const historyOptions = objectWithoutProperties(config, ['mode']);

  let historyMode = mode;
  if (historyMode === 'history' && !supportsPushState) {
    historyMode = 'hash';
  }

  historyOptions.getUserConfirmation = function (result, callback) {
    const { beforeNavigationHooks, $to, $from }  = ctx;
    const done = (ret) => {
      callback(ret !== false);
    };

    runQueue(
      beforeNavigationHooks,
      (hook, next) => {
        hook($to, $from, (to) => {
          callHook(hook, $to, $from, next, done);
        });
      },
      done
    );
  };

  const historyInstance = createHistoryBy(historyMode, historyOptions);

  // 为下一步获取 location 做准备
  historyInstance.block((location, action) => {
    const { guard } = ctx;
    guard.$from = guard.$to || {
      location: historyInstance.location,
      history: guard
    };
    guard.$to = {
      location,
      history: guard
    };
    return action;
  });

  return historyInstance;
}
