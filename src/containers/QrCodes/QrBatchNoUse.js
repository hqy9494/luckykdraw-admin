export default {
    initialState: {
      title: "批次状态",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "QrBatchNoUse",
        getProps: ["rts"]
      }
    ]
  };
  