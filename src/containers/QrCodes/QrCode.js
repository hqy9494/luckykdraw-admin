export default {
    initialState: {
      title: "二维码",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "QrCode",
        getProps: ["rts"]
      }
    ]
  };
  