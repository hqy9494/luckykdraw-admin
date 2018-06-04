export default {
    initialState: {
      title: "二维码模板详情",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "QrTemplateDetail",
        getProps: ["rts"]
      }
    ]
  };
  