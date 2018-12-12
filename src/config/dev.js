import baseConfig from './base';

const config = {
  env: 'dev',

  apiUrl: 'https://test.lkd.yooyuu.com.cn',
  downloadUrl: "https://test.lkd.yooyuu.com.cn",
  // apiUrl: 'https://lkd.yooyuu.com.cn'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
