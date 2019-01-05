export default {
    initialState: {
      title: "定向中奖",
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

  