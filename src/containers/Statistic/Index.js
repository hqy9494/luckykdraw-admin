export default {
  initialState: {
    title: "统 计",
    // subTitle: [{ display: "主 页" }],
    selectedKeys: "statistic",
    openKeys: "allStatistic"
  },
  component: [
    {
      module: "Statistic",
      getProps: ["rts"]
    }
  ]
};
