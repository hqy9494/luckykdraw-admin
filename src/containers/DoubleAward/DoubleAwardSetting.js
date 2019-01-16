export default {
    initialState: {
      title: "翻倍活动设置",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "DoubleAwardSetting",
        getProps: ["rts"]
      }
    ]
  };