export default {
    initialState: {
      title: "批次生成状态",
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
  