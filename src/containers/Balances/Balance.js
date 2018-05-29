export default {
    initialState: {
      title: "库存",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "Balance",
        getProps: ["rts"]
      }
    ]
  };
  