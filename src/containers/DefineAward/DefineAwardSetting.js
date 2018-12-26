export default {
    initialState: {
      title: "定向中奖设置",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "DefineAwardSetting",
        getProps: ["rts"]
      }
    ]
  };

  