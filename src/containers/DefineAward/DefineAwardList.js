export default {
    initialState: {
      title: "定制中奖",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "DefineAwardList",
        getProps: ["rts"]
      }
    ]
  };

  