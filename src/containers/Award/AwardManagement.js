export default {
    initialState: {
      title: "奖品管理",
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
  