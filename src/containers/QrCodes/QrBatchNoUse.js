export default {
    initialState: {
      title: "批次使用状态",
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
  