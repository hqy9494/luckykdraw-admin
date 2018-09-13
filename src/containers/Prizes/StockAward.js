export default {
    initialState: {
      title: "现派奖项",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "StockAward",
        getProps: ["rts"]
      }
    ]
  };
