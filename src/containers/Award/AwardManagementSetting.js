export default {
    initialState: {
      title: "奖品管理设置",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "AwardManagementSetting",
        getProps: ["rts"]
      }
    ]
  };
  