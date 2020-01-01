import { create } from 'tammy';
import xhr from 'tammy-adapter-xhr';

const instance = create({
  adapter: xhr
});

instance.interceptors.request.use(function (config) {
  if (config.mock) {
    config.url = '/mock' + config.url;
  }
  return config;
});

export default instance;