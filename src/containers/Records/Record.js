export default {
    initialState: {
      title: "中奖记录",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "Record",
        getProps: ["rts"]
      }
    ]
  };
  