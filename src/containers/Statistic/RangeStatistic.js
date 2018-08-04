export default {
  initialState: {
    title: "动态统计",
    // subTitle: [{ display: "主 页" }],
    selectedKeys: "statistic",
    openKeys: "rangeStatistic"
  },
  component: [
    {
      module: "RangeStatistic",
      getProps: ["rts"]
    }
  ]
};
