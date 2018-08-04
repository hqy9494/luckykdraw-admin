export default {
  initialState: {
    title: "销售数据",
    selectedKeys: "statistic",
    openKeys: "saleDetailStatistic"
  },
  component: [
    {
      module: "SaleDetailStatistic",
      getProps: ["rts"]
    }
  ]
};
