export default {
    initialState: {
      title: "设备奖项设置",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "AwardSetting",
        getProps: ["rts"]
      }
    ]
  };
  