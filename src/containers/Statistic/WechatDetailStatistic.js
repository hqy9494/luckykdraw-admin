export default {
  initialState: {
    title: "微信数据",
    selectedKeys: "statistic",
    openKeys: "wechatDetailStatistic"
  },
  component: [
    {
      module: "WechatDetailStatistic",
      getProps: ["rts"]
    }
  ]
};
