import baseConfig from './base';

const config = {
  apiUrl: "https://lkd.yooyuu.com.cn",
  env: 'prod'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
