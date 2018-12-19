export default {
    initialState: {
      title: "奖品列表",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "AwardList",
        getProps: ["rts"]
      }
    ]
  };
  