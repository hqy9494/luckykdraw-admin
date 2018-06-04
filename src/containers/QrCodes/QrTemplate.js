export default {
    initialState: {
      title: "二维码模板",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "QrTemplate",
        getProps: ["rts"]
      }
    ]
  };
  