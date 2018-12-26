export default {
  initialState: {
    title: "新建定向中奖",
    subtitle: "",
    breadcrumb: true
  },
  component: [
    {
      module: "DefineAwardSetting",
      getProps: ["rts"]
    }
  ]
};

  