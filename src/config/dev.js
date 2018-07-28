import baseConfig from './base';

const config = {
  env: 'dev',
  // apiUrl: 'https://691fcfdd.ngrok.io'
  apiUrl: 'http://192.168.16.54:4000'
  // apiUrl: 'https://lkd.yooyuu.com.cn'
  // apiUrl: 'http://192.168.16.54:4010'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
