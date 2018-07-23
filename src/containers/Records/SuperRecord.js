export default {
    initialState: {
      title: "大奖记录",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "SuperRecord",
        getProps: ["rts"]
      }
    ]
  };
  