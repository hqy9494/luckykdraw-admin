export default {
    initialState: {
      title: "设备中奖模板",
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
  