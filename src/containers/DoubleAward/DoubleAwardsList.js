export default {
    initialState: {
      title: "中奖信息",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "DoubleAwardsList",
        getProps: ["rts"]
      }
    ]
  };