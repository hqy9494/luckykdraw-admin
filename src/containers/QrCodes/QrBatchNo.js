export default {
    initialState: {
      title: "批次生成",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "QrBatchNo",
        getProps: ["rts"]
      }
    ]
  };
  