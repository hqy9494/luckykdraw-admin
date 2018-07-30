export default {
  initialState: {
    title: "奖池消耗",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "StockAwardConsume",
      getProps: ["rts"]
    }
  ]
};
