export default {
  initialState: {
    title: "设备数据",
    selectedKeys: "statistic",
    openKeys: "boxDetailStatistic"
  },
  component: [
    {
      module: "BoxDetailStatistic",
      getProps: ["rts"]
    }
  ]
};
