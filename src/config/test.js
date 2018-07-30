import baseConfig from './base';

const config = {
  env: 'test',
  apiUrl: 'https://test.lkd.yooyuu.com.cn'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
