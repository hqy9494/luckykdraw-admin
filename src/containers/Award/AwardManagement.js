export default {
    initialState: {
      title: "奖项管理",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "AwardManagement",
        getProps: ["rts"]
      }
    ]
  };
  