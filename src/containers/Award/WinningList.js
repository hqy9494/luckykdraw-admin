export default {
    initialState: {
      title: "中奖列表",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "WinningList",
        getProps: ["rts"]
      }
    ]
  };
  