export default {
    initialState: {
      title: "二维码批次",
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
  