import baseConfig from "./base";

const config = {
  env: "dev",
  // apiUrl: "https://691fcfdd.ngrok.io"
  apiUrl: "https://test.lkd.yooyuu.com.cn",
  // apiUrl: "https://lkd.yooyuu.com.cn"
};

export default Object.freeze(Object.assign({}, baseConfig, config));
