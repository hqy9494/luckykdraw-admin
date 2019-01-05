export default {
  initialState: {
    title: "惊喜奖列表",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "PrizeList",
      getProps: ["rts"]
    }
  ]
};
