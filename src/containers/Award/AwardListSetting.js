export default {
    initialState: {
      title: "奖项列表设置",
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
  