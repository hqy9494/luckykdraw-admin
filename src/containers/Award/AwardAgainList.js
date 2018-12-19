export default {
    initialState: {
      title: "再来一盒管理",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "AwardAgainList",
        getProps: ["rts"]
      }
    ]
  };
  