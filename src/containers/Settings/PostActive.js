export default {
    initialState: {
      title: "活动管理",
      breadcrumb: true
    },
    component: [
      {
        module: "PostActive",
        getProps: ["rts"]
      }
    ]
  };
