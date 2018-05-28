import baseConfig from './base';

const config = {
  apiUrl: 'https://api.dio.yoopin.com.cn',
  env: 'prod',
};

export default Object.freeze(Object.assign({}, baseConfig, config));
