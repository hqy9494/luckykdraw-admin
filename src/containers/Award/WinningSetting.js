export default {
    initialState: {
      title: "再来一盒设置",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "WinningSetting",
        getProps: ["rts"]
      }
    ]
  };
  