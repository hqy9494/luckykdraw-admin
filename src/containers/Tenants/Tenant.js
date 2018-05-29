export default {
    initialState: {
      title: "兑奖中心",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "Tenant",
        getProps: ["rts"]
      }
    ]
  };
  