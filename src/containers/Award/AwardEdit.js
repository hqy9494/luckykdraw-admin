export default {
    initialState: {
      title: "抽奖协议设置",
      subtitle: "",
      breadcrumb: true
    },
    component: [
      {
        module: "AwardEdit",
        getProps: ["rts"]
      }
    ]
  };
  