export default {
    initialState: {
      title: "奖品列表设置",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "AwardListSetting",
        getProps: ["rts"]
      }
    ]
  };
  