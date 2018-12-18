export default {
    initialState: {
      title: "中奖列表设置",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "WinningSetting",
        getProps: ["rts"]
      }
    ]
  };
  