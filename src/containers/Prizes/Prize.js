export default {
    initialState: {
      title: "奖品",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "Prize",
        getProps: ["rts"]
      }
    ]
  };
  