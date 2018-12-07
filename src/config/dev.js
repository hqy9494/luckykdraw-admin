import baseConfig from './base';

const config = {
  env: 'dev',
  // apiUrl: 'https://691fcfdd.ngrok.io'
  apiUrl: 'https://test.lkd.yooyuu.com.cn',
  downloadUrl: "https://test.lkd.yooyuu.com.cn",
  // apiUrl: 'https://lkd.yooyuu.com.cn'
  // apiUrl: 'http://192.168.16.61:4000'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
