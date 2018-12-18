export default {
    initialState: {
      title: "奖项列表",
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
  