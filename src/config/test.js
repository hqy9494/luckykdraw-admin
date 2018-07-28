import baseConfig from './base';

const config = {
  env: 'test',
  apiUrl: 'http://192.168.16.54:4000/'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
