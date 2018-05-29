export default {
    initialState: {
      title: "设备",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "Equipment",
        getProps: ["rts"]
      }
    ]
  };
  