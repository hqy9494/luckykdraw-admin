export default {
    initialState: {
      title: "奖项管理设置",
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
  