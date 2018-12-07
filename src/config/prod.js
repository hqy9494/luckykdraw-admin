import baseConfig from './base';

const config = {
  apiUrl: "https://lkd.yooyuu.com.cn",
  downloadUrl: "https://download.lkd.mrwish.net",
  env: 'prod'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
