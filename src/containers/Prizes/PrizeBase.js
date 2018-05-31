export default {
  initialState: {
    title: "普通奖品",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "PrizeBase",
      getProps: ["rts"]
    }
  ]
};
