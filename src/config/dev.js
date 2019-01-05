import baseConfig from './base';

const config = {
  env: 'dev',

  apiUrl: 'https://test.lkd.yooyuu.com.cn',
  // apiUrl: 'http://192.168.16.199:4010',
  downloadUrl: "https://test.lkd.yooyuu.com.cn",
  loginMqtt: 'mqtt://192.168.16.199:1883',
  // apiUrl: 'https://lkd.yooyuu.com.cn'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
